import React from 'react'
import ReactDOMServer from 'react-dom/server'
import createMatcher from './createMatcher'
import parsePath from './parsePath'
import type { Request, Response, NextFunction } from 'express'
import type { Key } from 'path-to-regexp'
import type { Page } from '../../../page/index'

export type DraftRoute = {
  keys?: Key[]
  regexp?: RegExp
  path: string,
  page: Page
}

export type Render = (content: string, state: object) => void

export type Task = {
  req: Request,
  res: Response,
  render: Render,
  next: () => void
}

export type Router = {
  readonly isBlock: boolean
  setRoutes(draftRoutes: DraftRoute[]): void
  tryRender(render: Render, req: Request, res: Response, next: NextFunction): Promise<void>
}

export default function createRouter(draftRoutes: DraftRoute[]): Router {
  let matcher = createMatcher(draftRoutes)
  let isBlock = true
  let tasks: Task[] = []

  async function getContentAndState(req: Request, res: Response) {
    const urlObj = parsePath(req.url)
    const matches = matcher(urlObj.pathname || '/')

    if (matches === null) return null

    try {
      const [view, store] = matches.page()
      const element = React.createElement(view, { store })
      const content = ReactDOMServer.renderToString(element)
      const state = store.state
      return [content, state] as const
    } catch (err) {
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
        tasks.forEach(async ({ req, res, render, next }) => {
          const contentAndState = await getContentAndState(req, res)
          if (contentAndState === null) {
            next()
          } else {
            const [content, state] = contentAndState
            render(content, state)
          }
        })
      }
    },
    async tryRender(render, req, res, next) {
      if (isBlock) {
        const task: Task = {
          req,
          res,
          render,
          next
        }
        tasks.push(task)
        console.log(`${req.url} will render after compile`)
      } else {
        const contentAndState = await getContentAndState(req, res)
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