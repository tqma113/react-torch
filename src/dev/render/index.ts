import ReactDOMServer from 'react-dom/server'
import createRouter from '../../router/index'
import compile from './compile'
import createHtml from '../../document'
import createHistory from '../../history/memory'
import { createErrorElement } from '../../error'
import { connect } from '../../context'
import { isPromise } from '../../utils'
import type { Request, Response, NextFunction } from 'express'
import type { DocumentProps } from '../../document'
import type { PageCreatorLoader, PageCreator } from '../../page'
import type { GlobalContextType } from '../../context'
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
  const routes = await compile(config, packContext)
  const router = createRouter(routes)

  return function (req: Request, res: Response, next: NextFunction) {
    const history = createHistory()
    history.push(req.url)
    const location = history.location

    const render = async (
      pageCreatorLoader: PageCreatorLoader<any, any> | null
    ) => {
      if (pageCreatorLoader === null) {
        next()
      } else {
        const serverContext: ServerContext = {
          req,
          res,
          ssr: config.ssr,
          env: process.env.NODE_ENV,
          side: 'server',
        }
        const clientContext: ClientContext = {
          ssr: config.ssr,
          env: process.env.NODE_ENV,
          side: 'client',
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
    router(render, location.pathname)
  }
}

async function loadPageCreator(
  draftPageCreator: PageCreator<any, any> | Promise<PageCreator<any, any>>
): Promise<PageCreator<any, any>> {
  if (isPromise(draftPageCreator)) {
    // @ts-ignore
    return (await draftPageCreator).default
  } else {
    return draftPageCreator
  }
}
