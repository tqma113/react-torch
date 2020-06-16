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

export default function createRouter(draftRoutes: DraftRoute[]): Router {
  let matcher = createMatcher(draftRoutes)
  let isBlock = true
  let tasks: Task[] = []

  async function getContentAndState(url: string) {
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
      throw err
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
        tasks.forEach(async ({ url, render, next }) => {
          const contentAndState = await getContentAndState(url)
          if (contentAndState === null) {
            next()
          } else {
            const [content, state] = contentAndState
            render(content, state)
          }
        })
      }
    },
    async tryRender(url: string, render: Render, next: () => void) {
      if (isBlock) {
        const task: Task = {
          url,
          render,
          next
        }
        tasks.push(task)
        console.log(`${url} will render after compile`)
      } else {
        const contentAndState = await getContentAndState(url)
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