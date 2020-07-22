import React from 'react'
import ReactDOMServer from 'react-dom/server'
import createMatcher from './createMatcher'
import createHistory from '../../../history/memory'
import { isPromise } from '../../../utils'
import {
  setPageLifeCircle,
  getLifeCircle
} from '../../../lifecircle'
import GlobalContext from '../../../context'
import type { NextFunction } from 'express'
import type { Key } from 'path-to-regexp'
import type { ServerContext } from '../../../index'
import type { PageCreatorLoader, PageCreator } from '../../../page/index'

export type DraftRoute = {
  keys?: Key[]
  regexp?: RegExp
  path: string,
  page: PageCreatorLoader<any, any>
}

export type Render = (content: string, state: object) => void

export type Task = {
  context: ServerContext,
  render: Render,
  next: () => void
}

export type Router = {
  readonly isBlock: boolean
  setRoutes(draftRoutes: DraftRoute[]): void
  tryRender(render: Render, context: ServerContext, next: NextFunction): Promise<void>
}

export default function createRouter(draftRoutes: DraftRoute[]): Router {
  let matcher = createMatcher(draftRoutes)
  let isBlock = true
  let tasks: Task[] = []

  async function getContentAndState(context: ServerContext) {
    const history = createHistory()
    history.push(context.req.url)
    const location = history.location
    const matches = matcher(location.pathname || '/')

    if (matches === null) return null

    try {
      const page = await loadPageCreator(matches.page())
      const symbol = Symbol('TORCH_PAGE')
      // set life circle
      setPageLifeCircle(symbol)
      // create page
      const [view, store] = await page(history, context)
      const lifecircle = getLifeCircle(symbol)

      await lifecircle.willCreate()

      const element = React.createElement(view)
      const globalElement = React.createElement(GlobalContext.Provider, {
        value: {
          location,
          history,
          store
        },
        children: element
      })
      const content = ReactDOMServer.renderToString(globalElement)
      return [content, store.state] as const
    } catch (err) {
      console.log(err)
      return [JSON.stringify(err), {}] as const
    }
  }

  return {
    get isBlock() {
      return isBlock
    },
    setRoutes(draftRoutes: DraftRoute[]) {
      matcher = createMatcher(draftRoutes)
      if (isBlock) {
        isBlock = false
        tasks.forEach(async ({ context, render, next }) => {
          const contentAndState = await getContentAndState(context)
          if (contentAndState === null) {
            next()
          } else {
            const [content, state] = contentAndState
            render(content, state)
          }
        })
      }
    },
    async tryRender(render, context, next) {
      if (isBlock) {
        const task: Task = {
          context,
          render,
          next
        }
        tasks.push(task)
        console.log(`${context.req.url} will render after compile`)
      } else {
        const contentAndState = await getContentAndState(context)
        if (contentAndState === null) {
          next()
        } else {
          const [content, state] = contentAndState
          render(content, state)
        }
      }
    }
  }
}

async function loadPageCreator(
  draftPageCreator: PageCreator<any, any> | Promise<PageCreator<any, any>>
): Promise<PageCreator<any, any>> {
  if (isPromise(draftPageCreator)) {
    // @ts-ignore
    return (await draftPageCreator).default
  } else {
    return draftPageCreator
  }
}