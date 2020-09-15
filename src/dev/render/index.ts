import ReactDOMServer from 'react-dom/server'
import { createMemoryHistory } from 'torch-history'
import createRouter from '../../lib/router'
import compile from './compile'
import createHtml from '../../lib/document'
import { createErrorElement } from '../../lib/error'
import { connect } from '../../lib/context'
import { isPromise } from '../../lib/utils'
import { Side } from '../../index'
import type { Request, Response, NextFunction } from 'express'
import type { DocumentProps } from '../../lib/document'
import type { PageCreatorLoader, PageCreator } from '../../lib/page'
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
  const applyRouter = (render: Render, path: string) => {
    return router(render, path)
  }

  return function (req: Request, res: Response, next: NextFunction) {
    const history = createMemoryHistory()
    history.push(req.url)
    const location = history.location

    const render = async (
      pageCreatorLoader: PageCreatorLoader<any, any> | null
    ) => {
      if (pageCreatorLoader === null) {
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
            const page = await loadPageCreator(pageCreatorLoader())
            const [view, store, lifecircle] = await page(history, serverContext)

            await lifecircle.willCreate()

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

        const [element, state] = await getElementAndState()
        const data: DocumentProps = {
          dir: config.dir,
          title: config.title,
          publicPath: '/__torch',
          context: clientContext,
          element,
          container: 'root',
          state,
          mode: config.styleMode,
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
      applyRouter(render, location.pathname)
    } catch (err) {
      res.status(502)
      res.send(err)
    }
  }
}

async function loadPageCreator(
  draftPageCreator: PageCreator<any, any> | Promise<PageCreator<any, any>>
): Promise<PageCreator<any, any>> {
  if (isPromise(draftPageCreator)) {
    return await draftPageCreator
  } else {
    return draftPageCreator
  }
}
