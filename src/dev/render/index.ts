import ReactDOMServer from 'react-dom/server'
import { createMemoryHistory } from 'torch-history'

import compile from './compile'

import createRouter from '../../router'
import { connect } from '../../context/index'
import { standardizePage } from '../../page'
import { requireDocument } from '../../internal/utils'
import { createErrorElement } from '../../internal/error'

import { Side } from '../../index'

import type { Request, Response, NextFunction } from 'express'
import type { DocumentProps } from '../../internal/document'
import type { GlobalContextType } from '../../context/index'
import type { Route, Router, Render } from '../../router'
import type {
  IntegralTorchConfig,
  ServerContext,
  ClientContext,
  PackContext,
} from '../../index'

export default async function createRender(
  config: IntegralTorchConfig,
  packContext: PackContext
) {
  let router: Router
  const update = (routes: Route[]) => {
    router = createRouter(routes)
  }
  const applyRouter = (path: string, render: Render) => {
    return router(path, render)
  }

  await compile(config, packContext, update)

  return function (req: Request, res: Response, next: NextFunction) {
    const history = createMemoryHistory()
    history.push(req.url)
    const location = history.location

    const render: Render = async (pageCreator, params) => {
      if (pageCreator === null) {
        next()
      } else {
        const serverContext: ServerContext = {
          ...packContext,
          req,
          res,
          side: Side.Server,
        }
        const clientContext: ClientContext = {
          ...packContext,
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

    applyRouter(location.pathname, render).catch((err) => {
      res.status(502)
      res.send(err.stack)
    })
  }
}
