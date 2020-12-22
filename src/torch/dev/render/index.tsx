import React from 'react'
import { createMemoryHistory } from 'torch-history'

import compile from './compile'

import { createRouter, connect, standardizePage } from '../../../client'
import { requireDocument } from '../../../internal/utils'
import { createErrorElement } from '../../../internal/error'

import { Side } from '../../../index'

import type { DocumentProps } from '../../../internal/document'
import type { GlobalContextType, Route, Router, Render } from '../../../client'
import type {
  IntegralTorchConfig,
  ServerContext,
  ClientContext,
  PackContext,
  ScriptPreload,
  StylePreload,
} from '../../../index'

export default async function createRender(config: IntegralTorchConfig) {
  let router: Router
  const update = (routes: Route[]) => {
    router = createRouter(routes)
  }
  const applyRouter = (path: string, render: Render) => {
    return router(path, render)
  }

  const packContext: PackContext = {
    ssr: config.ssr,
    env: process.env.NODE_ENV,
    packSide: Side.Server,
  }
  await compile(config, packContext, update)

  return function (
    url: string,
    assets: { index: string; vendor: string },
    scripts: ScriptPreload[],
    styles: StylePreload[],
    others: Record<string, any>
  ) {
    const history = createMemoryHistory({ initialEntries: [url] })

    const render: Render = async (pageCreator, params) => {
      if (pageCreator === null) {
        return <></>
      } else {
        const serverContext: ServerContext = {
          ...packContext,
          side: Side.Server,
        }
        const clientContext: ClientContext = {
          ...packContext,
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
            return [createErrorElement(err.stack), {}] as const
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

    return applyRouter(history.location.pathname, render).catch((err) => {
      return createErrorElement(err.stack)
    })
  }
}
