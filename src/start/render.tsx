import path from 'path'
import React from 'react'
import invariant from 'tiny-invariant'
import { createMemoryHistory } from 'torch-history'

import { createRouter, connect, standardizePage } from '../client'
import { requireDocument } from '../internal/utils'
import { createErrorElement } from '../internal/error'
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
  ScriptPreload,
  StylePreload,
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

  return function (
    url: string,
    assets: { index: string; vendor: string },
    scripts: ScriptPreload[],
    styles: StylePreload[],
    others: Record<string, any>,
  ) {
    const history = createMemoryHistory({ initialEntries: [url] })
    const render: Render = async (pageCreator, params) => {
      if (pageCreator === null) {
        return <></>
      } else {
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
            const globalContext: GlobalContextType = {
              location: history.location,
              history,
              context: serverContext,
              params,
            }
            const { store, beforeCreate, create, created } = standardizePage(
              await pageCreator(globalContext)
            )

            await beforeCreate()
            const component = await create()
            await created()

            const element = connect(component)(globalContext)
            return [element, store.getState()] as const
          } catch (err) {
            return [createErrorElement(err.stack || err.message), {}] as const
          }
        }

        const [element, state] = await getElementAndState()
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
          styles,
          scripts,
        }
        const createHtml = requireDocument(config)
        return createHtml(data)
      }
    }

    return router(history.location.pathname, render).catch((err) => {
      return createErrorElement(err.stack)
    })
  }
}
