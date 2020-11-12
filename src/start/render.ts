import path from 'path'
import invariant from 'tiny-invariant'
import ReactDOMServer from 'react-dom/server'
import { createMemoryHistory } from 'torch-history'

import createRouter from '../lib/router'
import { connect } from '../lib/context'
import { standardizePage } from '../lib/page'
import { requireDocument } from '../lib/utils'
import { createErrorElement } from '../lib/error'
import {
  Side,
  TORCH_DIR,
  TORCH_SERVER_DIR,
  TORCH_ROUTES_FILE_NAME,
} from '../index'

import type { Route, Render } from '../lib/router'
import type { Request, Response, NextFunction } from 'express'
import type { DocumentProps } from '../lib/document'
import type { GlobalContextType } from '../lib/context'
import type {
  IntegralTorchConfig,
  ClientContext,
  ServerContext,
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

  invariant(!routes, 'You need run `build` before run `start`!')

  const router = createRouter(routes)

  return function (req: Request, res: Response, next: NextFunction) {
    const history = createMemoryHistory()
    history.push(req.url)
    const location = history.location

    const render: Render = async (pageCreator, params) => {
      if (pageCreator === null) {
        next()
      } else {
        const serverContext: ServerContext = {
          req,
          res,
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
              location,
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
          container: 'root',
          state,
          mode: config.styleMode,
          ...res.locals,
          assets: res.locals.assets,
          styles: res.locals.styles,
          scripts: res.locals.scripts,
        }
        const createHtml = requireDocument(config)
        const html = createHtml(data)
        const stream = ReactDOMServer.renderToNodeStream(html)

        res.status(200)
        res.setHeader('Content-type', 'text/html')
        res.write('<!DOCTYPE html>')
        stream.pipe(res)
      }
    }

    router(location.pathname, render).catch((err) => {
      res.status(502)
      res.send(err.stack)
    })
  }
}
