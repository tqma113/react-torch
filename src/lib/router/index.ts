import { createRouter } from 'torch-router'
import type { DraftRoute } from 'torch-router'
import type { PageCreatorLoader } from '../page'

export type Render = (
  pageCreatorLoader: PageCreatorLoader<any, any> | null
) => void

export type Module = PageCreatorLoader<any, any>

export type Route = DraftRoute<Module>

export type Router = (path: string, render: Render) => void

export default function (routes: Route[]): Router {
  const router = createRouter(routes)

  return (path, render) => {
    const pageCreatorLoader = router(path)
    render(pageCreatorLoader)
  }
}
