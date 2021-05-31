import { createRouter as cr } from 'torch-router'

import { createErrorElement } from '../../internal/error'
import { isTorchPage, createPage } from '../page'

import type { PageCreater } from '../page'
import type { DraftRoute, Params } from 'torch-router'
import type { ScriptPreload, StylePreload } from '../../'

export type Render<RT> = (
  module: PageModule | null,
  params: Params
) => Promise<RT>

export type AssetsContextType = {
  scripts: ScriptPreload[]
  styles: StylePreload[]
}

type Resources = {
  styles: StylePreload[]
  scripts: ScriptPreload[]
}

export type ResourcesTransform = (
  context: AssetsContextType,
  assets: Record<string, string>
) => Resources

export type RouteModule = {
  pageCreater: PageCreater<any, any> | Lazy<PageCreater<any, any>>
  transform?: ResourcesTransform
}

export type PageModule = {
  pageCreater: PageCreater<any, any>
  transform: ResourcesTransform
}

export type Route = DraftRoute<RouteModule>

export type RenderProps = {
  module: PageModule | null
  params: Params
}

export type Router = (path: string) => Promise<RenderProps>

export function createRouter(routes: Route[]): Router {
  const router = cr(routes)

  return async (path) => {
    try {
      const matches = router(path)
      if (matches === null) {
        return {
          module: null,
          params: {},
        }
      } else {
        const {
          module: { pageCreater, transform = identify },
          params,
        } = matches
        if (isTorchPage(pageCreater)) {
          return {
            module: { pageCreater, transform },
            params,
          }
        } else {
          const pctr = await dynamic(pageCreater)
          return {
            module: { pageCreater: pctr, transform },
            params,
          }
        }
      }
    } catch (err) {
      return {
        module: {
          pageCreater: createPage(
            () => () => createErrorElement(err.stack || err.message)
          ),
          transform: identify,
        },
        params: {},
      }
    }
  }
}

export type Lazy<T> = () =>
  | T
  | Promise<{
      default: T
    }>

async function dynamic(
  loader: Lazy<PageCreater<any, any>>
): Promise<PageCreater<any, any>> {
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

function identify<I>(input: I): I {
  return input
}
