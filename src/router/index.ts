import { createRouter } from 'torch-router'
import type { DraftRoute } from 'torch-router'
import type { PageCreatorLoader } from '../page/index'

export type Render = (
  pageCreatorLoader: PageCreatorLoader<any, any> | null
) => void

export type Module = PageCreatorLoader<any, any>

export type Route = DraftRoute<Module>

export type Router = (render: Render, path: string) => Promise<void>

export default function (routes: Route[]): Router {
  const router = createRouter(routes)

  return async (render, path) => {
    const pageCreatorLoader = await router(path)
    render(pageCreatorLoader)
  }
}
