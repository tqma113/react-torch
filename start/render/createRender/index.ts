import React from 'react'
import { Key } from 'path-to-regexp'
import ReactDOMServer from 'react-dom/server'
import createMatcher from './createMatcher'
import parsePath from './parsePath';

export type DraftRoute = {
  keys?: Key[]
  regexp?: RegExp
  path: string,
  page: () => Promise<React.ComponentType>
}

export type Render = (content: string) => void

export type Task = {
  url: string,
  render: Render,
  next: () => void
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
      return content
    } catch (err) {
      return JSON.stringify(err)
    }
  }

  return async function tryRender(url: string, render: Render, next: () => void) {

    const content = await getContent(url)
    if (content === null) {
      next()
    } else {
      render(content)
    }
  }
}