import path from 'path'
import React from 'react'
import invariant from 'tiny-invariant'
import { createMemoryHistory } from 'torch-history'

import {
  createRouter,
  connectContext,
  connectModels,
  preloadModels,
  getStates,
} from '../client'
import { requireDocument } from '../internal/utils'
import { createErrorElement } from '../internal/error'
import { runCreater, setupPage } from '../internal/hook'
import {
  Side,
  TORCH_DIR,
  TORCH_SERVER_DIR,
  TORCH_ROUTES_FILE_NAME,
} from '../index'

import type { DocumentProps } from '../internal/document'
import type { Route, Render, GlobalContextType } from '../client'
import type {
  IntegralTorchConfig,
  ClientContext,
  ServerContext,
  RenderContext,
} from '../index'

function getRoutes(config: IntegralTorchConfig) {
  const outputPath = path.join(
    config.dir,
    TORCH_DIR,
    TORCH_SERVER_DIR,
    TORCH_ROUTES_FILE_NAME
  )
  const module = require(outputPath)
  return module.default || module
}

export default function createRender(config: IntegralTorchConfig) {
  const routes: Route[] = getRoutes(config)

  invariant(routes, 'You need run `build` before run `start`!')

  const router = createRouter(routes)

  return async function ({
    url,
    assets,
    scripts,
    styles,
    others,
  }: RenderContext) {
    const history = createMemoryHistory({ initialEntries: [url] })
    const render: Render<JSX.Element> = async (module, params) => {
      if (module === null) {
        return createErrorElement('match error')
      } else {
        const { pageCreater, transform } = module
        const serverContext: ServerContext = {
          ssr: config.ssr,
          env: process.env.NODE_ENV,
          side: Side.Server,
        }
        const clientContext: ClientContext = {
          ssr: config.ssr,
          env: process.env.NODE_ENV,
          side: Side.Client,
        }

        const getElementAndState = async () => {
          try {
            const { createStore, initialState, initializer } = pageCreater
            const store = createStore(initialState as any)
            const globalContext: GlobalContextType = {
              location: history.location,
              history,
              context: serverContext,
              params,
              store,
            }
            const component = await runCreater(() => initializer(globalContext))
            if (serverContext.ssr) {
              await Promise.all(setupPage())
              await preloadModels()
            }

            const Comp = connectContext(connectModels(component))(globalContext)
            return [React.createElement(Comp), store.getState()] as const
          } catch (err) {
            return [
              createErrorElement(
                err instanceof Error
                  ? err.stack || err.message
                  : JSON.stringify(err)
              ),
              {},
            ] as const
          }
        }

        const [element, state] = await getElementAndState()

        const { scripts: sps, styles: sts } = transform(
          { scripts, styles },
          assets
        )
        const data: DocumentProps = {
          dir: config.dir,
          title: config.title,
          cdn: config.cdn,
          context: clientContext,
          element,
          container: config.container,
          state,
          mode: config.styleMode,
          ...others,
          assets,
          styles: sts,
          scripts: sps,
          stateList: getStates(),
        }
        const createHtml = requireDocument(config)
        return createHtml(data)
      }
    }

    try {
      const { module, params } = await router(history.location.pathname)
      return render(module, params)
    } catch (err) {
      console.log(err)
      return createErrorElement(
        err instanceof Error ? err.stack || err.message : JSON.stringify(err)
      )
    }
  }
}
