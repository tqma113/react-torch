import { createRouter } from 'torch-router'
import { isTorchPage } from '../page'
import type { PageCreater } from '../page'
import type { DraftRoute } from 'torch-router'

export type Render = (
  pageCreater: PageCreater | Promise<PageCreater> | null
) => Promise<void>

export type RouteModule = PageCreater | Lazy<PageCreater>

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

export type Lazy<T> = () =>
  | T
  | Promise<{
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

function isPromise<T, S>(
  input: PromiseLike<T> | S
): input is PromiseLike<T> {
  // @ts-ignore
  return input && input.then && typeof input.then === 'function'
}