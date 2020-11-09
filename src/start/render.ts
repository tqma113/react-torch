import path from 'path'
import ReactDOMServer from 'react-dom/server'
import { createMemoryHistory } from 'torch-history'
import createRouter from '../lib/router'
import { createErrorElement } from '../lib/error'
import { connect } from '../lib/context'
import {
  Side,
  TORCH_DIR,
  TORCH_SERVER_DIR,
  TORCH_ROUTES_FILE_NAME,
} from '../index'
import { getViewAndStoreFromPage } from '../lib/page'
import { requireDocument, isPromise } from '../lib/utils'
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
  let routes: Route[] = getRoutes(config)

  if (!routes) {
    throw new Error('You need run `npm run build` before `npm start`!')
  }

  const router = createRouter(routes)

  return function (req: Request, res: Response, next: NextFunction) {
    const history = createMemoryHistory()
    history.push(req.url)
    const location = history.location

    const render: Render = async (pct, params) => {
      if (pct === null) {
        next()
      } else {
        const pageCreator = isPromise(pct) ? await pct : pct
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
            const page = await pageCreator({
              location,
              history,
              context: serverContext,
              params,
            })
            const [view, store] = getViewAndStoreFromPage(page)

            const globalContext: GlobalContextType = {
              location,
              history,
              context: serverContext,
              params,
            }
            const element = connect(view)(globalContext)
            return [element, store.getState()] as const
          } catch (err) {
            return [createErrorElement(err.stack || err.message), {}] as const
          }
        }

        const createHtml = requireDocument(config)
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
        const html = createHtml(data)
        const stream = ReactDOMServer.renderToNodeStream(html)
        res.status(200)
        res.setHeader('Content-type', 'text/html')
        res.write('<!DOCTYPE html>')
        stream.pipe(res)
      }
    }

    try {
      router(location.pathname, render)
    } catch (err) {
      res.status(502)
      res.send(err)
    }
  }
}
