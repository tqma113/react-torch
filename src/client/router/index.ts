import { createRouter as cr } from 'torch-router'

import { createErrorElement } from '../../internal/error'
import { isTorchPage, createPage } from '../page'

import type { PageCreater } from '../page'
import type { DraftRoute, Params } from 'torch-router'

export type Render<RT> = (
  pageCreater: PageCreater | null,
  params: Params
) => Promise<RT>

export type RouteModule = PageCreater | Lazy<PageCreater>

export type Route = DraftRoute<RouteModule>

export type Router = <RT>(path: string, render: Render<RT>) => Promise<RT>

export function createRouter(routes: Route[]): Router {
  const router = cr(routes)

  return async (path, render) => {
    try {
      const matches = router(path)
      if (matches === null) {
        return render(null, {})
      } else {
        const { module: pageCreater, params } = matches
        if (isTorchPage(pageCreater)) {
          return render(pageCreater, params)
        } else {
          return render(await dynamic(pageCreater), params)
        }
      }
    } catch (err) {
      return render(
        createPage(() => () => createErrorElement(err.stack || err.message)),
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
    return createPage(() => () => createErrorElement(err.stack || err.message))
  }
}

function isPromise<T, S>(input: PromiseLike<T> | S): input is PromiseLike<T> {
  // @ts-ignore
  return input && input.then && typeof input.then === 'function'
}
