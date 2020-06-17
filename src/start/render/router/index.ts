import React from 'react'
import ReactDOMServer from 'react-dom/server'
import createMatcher from './createMatcher'
import createHistory from '../../../history/memory'
import type { Key } from 'path-to-regexp'
import type { Page } from '../../../page/index'
import type { ServerContext } from '../../../index'

export type DraftRoute = {
  keys?: Key[]
  regexp?: RegExp
  path: string,
  page: Page
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

  function getContentAndState(context: ServerContext) {
    const history = createHistory()
    history.push(context.req.url)
    const location = history.location
    const matches = matcher(location.pathname || '/')

    if (matches === null) return null

    try {
      const [view, store] = matches.page(history, context)
      const element = React.createElement(view, { store })
      const content = ReactDOMServer.renderToString(element)
      const state = store.state
      return [content, state] as const
    } catch (err) {
      return [JSON.stringify(err), {}] as const
    }
  }

  return {
    tryRender: async (render, context, next) => {
      const result = getContentAndState(context)
      if (result === null) {
        next()
      } else {
        const [content, state] = result
        render(content, state)
      }
    }
  }
}