import React from 'react'
import ReactDOMServer from 'react-dom/server'
import createMatcher from './createMatcher'
import createHistory from '../../../history/memory'
import { isPromise } from '../../../utils'
import type { Key } from 'path-to-regexp'
import type { PageCreator, PageCreatorLoader } from '../../../page/index'
import type { ServerContext } from '../../../index'

export type DraftRoute = {
  keys?: Key[]
  regexp?: RegExp
  path: string,
  page: PageCreatorLoader<any ,any>
}

export type Render = (content: string, state: object) => void

export type Task = {
  url: string,
  render: Render,
  next: () => void
}

export type Router = {
  tryRender(render: Render, context: ServerContext, next: () => void): Promise<void>
}

export default function createRender(draftRoutes: DraftRoute[]): Router {
  let matcher = createMatcher(draftRoutes)

  async function getContentAndState(context: ServerContext) {
    const history = createHistory()
    history.push(context.req.url)
    const location = history.location
    const matches = matcher(location.pathname || '/')

    if (matches === null) return null

    try {
      const pageCreatorLoader = matches.page()
      const page = await loadPageCreator(pageCreatorLoader)
      const [view, store] = page(history, context)
      const element = React.createElement(view)
      const content = ReactDOMServer.renderToString(element)
      const state = store.state
      return [content, state] as const
    } catch (err) {
      console.error(err)
      return [JSON.stringify(err), {}] as const
    }
  }

  return {
    tryRender: async (render, context, next) => {
      const result = await getContentAndState(context)
      if (result === null) {
        next()
      } else {
        const [content, state] = result
        render(content, state)
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