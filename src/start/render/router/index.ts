import React from 'react'
import ReactDOMServer from 'react-dom/server'
import createMatcher from './createMatcher'
import parsePath from './parsePath'
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
  url: string,
  render: Render,
  next: () => void
}

export type Router = {
  readonly isBlock: boolean
  setRoutes(draftRoutes: DraftRoute[]): void
  tryRender(url: string, render: Render, next: () => void): Promise<void>
}

export default function createRender(draftRoutes: DraftRoute[]) {
  let matcher = createMatcher(draftRoutes)

  async function getContent(url: string) {
    const urlObj = parsePath(url)
    const matches = matcher(urlObj.pathname || '/')

    if (matches === null) return null

    try {
      const [view, store] = matches.page
      const element = React.createElement(view, { store })
      const content = ReactDOMServer.renderToString(element)
      const state = store.state
      return [content, state] as const
    } catch (err) {
      return [JSON.stringify(err), {}] as const
    }
  }

  return {
    tryRender: async function tryRender(url: string, render: Render, next: () => void) {
      const result = await getContent(url)
      if (result === null) {
        next()
      } else {
        const [content, state] = result
        render(content, state)
      }
    }
  }
}