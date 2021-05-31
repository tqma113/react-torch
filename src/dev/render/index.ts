import React from 'react'
import { createMemoryHistory } from 'torch-history'

import compile from './compile'

import {
  createRouter,
  connectContext,
  connectModels,
  preloadModels,
  getStates,
} from '../../client'
import { requireDocument } from '../../internal/utils'
import { createErrorElement } from '../../internal/error'
import { runCreater, setupPage } from '../../internal/hook'

import { Side } from '../../index'

import type { DocumentProps } from '../../internal/document'
import type { GlobalContextType, Route, Router } from '../../client'
import type {
  IntegralTorchConfig,
  ServerContext,
  ClientContext,
  PackContext,
  RenderContext,
} from '../../index'

export type Assets = { index: string; vendor: string } & Record<string, string>

export default async function createRender(config: IntegralTorchConfig) {
  let router: Router
  const update = (routes: Route[]) => {
    router = createRouter(routes)
  }

  const packContext: PackContext = {
    ssr: config.ssr,
    env: process.env.NODE_ENV,
    packSide: Side.Server,
  }
  await compile(config, packContext, update)

  return async function ({
    url,
    assets,
    scripts,
    styles,
    others,
  }: RenderContext) {
    const history = createMemoryHistory({ initialEntries: [url] })
    const { module, params } = await router(history.location.pathname)

    const render = async (): Promise<JSX.Element> => {
      try {
        if (module === null) {
          return createErrorElement('match error')
        } else {
          const { pageCreater, transform } = module
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
              const { createStore, initialState, initializer } = pageCreater
              const store = createStore(initialState as any)
              const globalContext: GlobalContextType = {
                location: history.location,
                history,
                context: serverContext,
                params,
                store,
              }
              const component = await runCreater(() =>
                initializer(globalContext)
              )

              if (serverContext.ssr) {
                await Promise.all(setupPage())
                await preloadModels()
              }

              const Comp = connectContext(connectModels(component))(
                globalContext
              )
              return [React.createElement(Comp), store.getState()] as const
            } catch (err) {
              console.error(err)
              return [createErrorElement(err.stack), {}] as const
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
      } catch (err) {
        console.error(err)
        return createErrorElement(err.stack)
      }
    }

    return render()
  }
}
