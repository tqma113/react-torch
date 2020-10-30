import { createRouter } from 'torch-router'
import { isTorchPage, createPage } from '../page'
import { createErrorElement } from '../error'
import type { PageCreater } from '../page'
import type { DraftRoute, Params } from 'torch-router'

export type Render = (
  pageCreater: PageCreater | Promise<PageCreater> | null,
  params: Params
) => Promise<void>

export type RouteModule = PageCreater | Lazy<PageCreater>

export type Route = DraftRoute<RouteModule>

export type Router = (path: string, render: Render) => void

export default function (routes: Route[]): Router {
  const router = createRouter(routes)

  return (path, render) => {
    try {
      const matches = router(path)
      if (matches === null) {
        render(null, {})
      } else {
        const { module: pageCreater, params } = matches
        if (isTorchPage(pageCreater)) {
          render(pageCreater, params)
        } else {
          render(dynamic(pageCreater), params)
        }
      }
    } catch (err) {
      render(
        createPage(() => () => createErrorElement(JSON.stringify(err))),
        {}
      )
    }
  }
}

export type Lazy<T> = () =>
  | T
  | Promise<{
      default: T
    }>

async function dynamic(loader: Lazy<PageCreater>): Promise<PageCreater> {
  try {
    const module = loader()
    if (isPromise(module)) {
      return (await module).default
    } else {
      return module
    }
  } catch (err) {
    return createPage(() => () => createErrorElement(JSON.stringify(err)))
  }
}

function isPromise<T, S>(input: PromiseLike<T> | S): input is PromiseLike<T> {
  // @ts-ignore
  return input && input.then && typeof input.then === 'function'
}
