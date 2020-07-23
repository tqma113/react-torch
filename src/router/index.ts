import createMatcher from './createMatcher'
import type { Key } from 'path-to-regexp'
import type { PageCreatorLoader } from '../page/index'

export type DraftRoute = {
  keys?: Key[]
  regexp?: RegExp
  path: string,
  page: PageCreatorLoader<any ,any>
}

export type Render = (pageCreatorLoader: PageCreatorLoader<any, any> | null) => void

export default function createRender(
  draftRoutes: DraftRoute[]
): (render: Render, path: string) => Promise<void> {
  const matcher = createMatcher(draftRoutes)

  async function getPageCreatorLoader(path: string) {
    const matches = matcher(path || '/')

    if (matches === null) {
      return null
    } else {
      return matches.page
    }
  }

  return async (render, path) => {
    const pageCreatorLoader = await getPageCreatorLoader(path)
    render(pageCreatorLoader)
  }
}