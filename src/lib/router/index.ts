import { createRouter } from 'torch-router'
import { isTorchPage } from '../page'
import { isPromise } from '../utils'
import type { PageCreater } from '../page'
import type { DraftRoute } from 'torch-router'

export type Render = (
  pageCreater: PageCreater<any, any> | Promise<PageCreater<any, any>> | null
) => Promise<void>

export type RouteModule = PageCreater<any, any> | Lazy<PageCreater<any, any>>

export type Route = DraftRoute<RouteModule>

export type Router = (path: string, render: Render) => void

export default function (routes: Route[]): Router {
  const router = createRouter(routes)

  return (path, render) => {
    const pageCreater = router(path)
    if (pageCreater === null) {
      render(null)
    } else if (isTorchPage(pageCreater)) {
      render(pageCreater)
    } else {
      render(dynamic(pageCreater))
    }
  }
}

export type Lazy<T> = () => T | Promise<{
  default: T
}>

async function dynamic<T>(loader: Lazy<T>): Promise<T> {
  const module = loader()
  if (isPromise(module)) {
    return (await module).default
  } else {
    return module
  }
}
