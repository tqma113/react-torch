import { createRouter } from 'torch-router'
import { isTorchPage } from '../page'
import type { PageCreator } from '../page'
import type { DraftRoute } from 'torch-router'

export type Render = (
  pageCreator: PageCreator<any, any> | Promise<PageCreator<any, any>> | null
) => Promise<void>

export type RouteModule = PageCreator<any, any> | Lazy<PageCreator<any, any>>

export type Route = DraftRoute<RouteModule>

export type Router = (path: string, render: Render) => void

export default function (routes: Route[]): Router {
  const router = createRouter(routes)

  return (path, render) => {
    const pageCreator = router(path)
    if (pageCreator === null) {
      render(null)
    } else if (isTorchPage(pageCreator)) {
      render(pageCreator)
    } else {
      render(dynamic(pageCreator))
    }
  }
}

export type Lazy<T> = () => Promise<{
  default: T
}>

async function dynamic<T>(lazyModule: Lazy<T>): Promise<T> {
  return (await lazyModule()).default
}
