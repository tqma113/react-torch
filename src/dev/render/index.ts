import ReactDOMServer from 'react-dom/server'
import { createMemoryHistory } from 'torch-history'
import createRouter from '../../lib/router'
import compile from './compile'
import { createErrorElement } from '../../lib/error'
import { connect } from '../../lib/context'
import { Side } from '../../index'
import { requireDocument, isPromise } from '../../lib/utils'
import type { Request, Response, NextFunction } from 'express'
import type { DocumentProps } from '../../lib/document'
import type { GlobalContextType } from '../../lib/context'
import type { Route, Router, Render } from '../../lib/router'
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
  const update = (routes: Route[]) => {
    router = createRouter(routes)
  }
  await compile(config, packContext, update)

  let router: Router
  const applyRouter = (path: string, render: Render) => {
    return router(path, render)
  }

  return function (req: Request, res: Response, next: NextFunction) {
    const history = createMemoryHistory()
    history.push(req.url)
    const location = history.location

    const render: Render = async (pct) => {
      if (pct === null) {
        next()
      } else {
        const pageCreator = isPromise(pct) ? await pct : pct
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
            const [view, store, lifecycle] = (await pageCreator)(
              history,
              serverContext
            )

            await lifecycle.willCreate()

            const globalContext: GlobalContextType = {
              location,
              history,
              store,
              context: serverContext,
            }
            const element = connect(view)(globalContext)
            return [element, store.state] as const
          } catch (err) {
            return [createErrorElement(JSON.stringify(err)), {}] as const
          }
        }
        const createHtml = requireDocument(config)
        const [element, state] = await getElementAndState()
        const data: DocumentProps = {
          dir: config.dir,
          title: config.title,
          publicPath: '/__torch/',
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
      applyRouter(location.pathname, render)
    } catch (err) {
      res.status(502)
      res.send(err)
    }
  }
}
