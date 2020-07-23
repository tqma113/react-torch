import ReactDOMServer from 'react-dom/server'
import createRouter from './router/index';
import compile from './compile'
import {
  setPageLifeCircle,
  getLifeCircle
} from '../../lifecircle'
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
} from '../../index'

export default async function createRender (config: IntegralTorchConfig) {
  const router = createRouter([])
  await compile(config, router)

  return function (req: Request, res: Response, next: NextFunction) {
    const history = createHistory()
    history.push(req.url)
    const location = history.location

    const render = async (pageCreatorLoader: PageCreatorLoader<any, any> | null) => {
      if (pageCreatorLoader === null) {
        next()
      } else {
        const serverContext: ServerContext = {
          req,
          res,
          ssr: config.ssr,
          env: process.env.NODE_ENV,
          side: 'server'
        }
        const clientContext: ClientContext = {
          ssr: config.ssr,
          env: process.env.NODE_ENV,
          side: 'client'
        }
        
        const getElementAndState = async () => {
          try {
            const page = await loadPageCreator(pageCreatorLoader())
            
            const symbol = Symbol('TORCH_PAGE')
            // set life circle
            setPageLifeCircle(symbol)
            // create page
            const [view, store] = await page(history, serverContext)
            const lifecircle = getLifeCircle(symbol)

            await lifecircle.willCreate()

            const globalContext: GlobalContextType = {
              location,
              history,
              store,
              context: serverContext
            }
            const element = connect(view)(globalContext)
            return [element, store.state] as const
          } catch (err) {
            console.log(err)
            return [createErrorElement(JSON.stringify(err)), {}] as const
          }
        }

        const [element, state] = await getElementAndState()
        const data: DocumentProps = {
          title: config.title,
          publicPath: '/__torch',
          context: clientContext,
          element,
          container: 'root',
          state,
          assets: res.locals.assets
        }
        const html = createHtml(data)
        const stream = ReactDOMServer.renderToStaticNodeStream(html)
        res.setHeader('Content-type', 'text/html')
        res.write('<!DOCTYPE html>')
        stream.pipe(res)
      }
    }
    router.tryRender(render, location.pathname)
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