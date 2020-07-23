import createMatcher from './createMatcher'
import type { Key } from 'path-to-regexp'
import type { PageCreatorLoader } from '../../../page/index'

export type DraftRoute = {
  keys?: Key[]
  regexp?: RegExp
  path: string,
  page: PageCreatorLoader<any, any>
}

export type Render = (pageCreateLoader: PageCreatorLoader<any, any> | null) => void

export type Task = {
  path: string,
  render: Render,
}

export type Router = {
  readonly isBlock: boolean
  setRoutes(draftRoutes: DraftRoute[]): void
  tryRender(render: Render, path: string): Promise<void>
}

export default function createRouter(draftRoutes: DraftRoute[]): Router {
  let matcher = createMatcher(draftRoutes)
  let isBlock = true
  let tasks: Task[] = []

  function getPageCreatorLoader(path: string) {
    const matches = matcher(path || '/')

    if (matches === null) {
      return null
    } else {
      return matches.page
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
        tasks.forEach(async ({ path, render }) => {
          const pageCreatorLoader = await getPageCreatorLoader(path)
          render(pageCreatorLoader)
        })
      }
    },
    async tryRender(render, path) {
      if (isBlock) {
        const task: Task = {
          path,
          render
        }
        tasks.push(task)
        console.log(`${path} will render after compile`)
      } else {
        const pageCreatorLoader = getPageCreatorLoader(path)
        render(pageCreatorLoader)
      }
    }
  }
}