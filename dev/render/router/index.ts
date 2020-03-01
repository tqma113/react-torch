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
  render: Render
}

const NOT_MATCH = 'not match'

export default function createRouter(draftRoutes: DraftRoute[]) {
  let matcher = createMatcher(draftRoutes)
  let isBlock = true
  let tasks: Task[] = []

  async function getContent(url: string) {
    const urlObj = parsePath(url)
    const matches = matcher(urlObj.pathname || '/')

    if (matches === null) return NOT_MATCH

    try {
      const [view, store] = matches.page
      const element = React.createElement(view, { store })
      const content = ReactDOMServer.renderToString(element)
      return content
    } catch (err) {
      return JSON.stringify(err)
    }
  }

  return {
    get isBlock() {
      return isBlock
    },
    updateRoutes(draftRoutes: DraftRoute[]) {
      matcher = createMatcher(draftRoutes)
      if (isBlock) {
        isBlock = false
        tasks.forEach(async ({ url, render }) => {
          const content = await getContent(url)
          render(content)
        })
      }
    },
    async tryRender(url: string, render: Render) {
      if (isBlock) {
        const task: Task = {
          url,
          render
        }
        tasks.push(task)
      }

      const content = await getContent(url)
      render(content)
    }
  }
}