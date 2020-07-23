import ReactDOMServer from 'react-dom/server'
import createRouter from './router'
import getRoutes from './getRoutes'
import createHtml from '../../document'
import type { ReactElement } from 'react';
import type { DraftRoute } from './router'
import type { Request, Response, NextFunction } from 'express'
import type { DocumentProps } from '../../document'
import type {
  IntegralTorchConfig,
  ClientContext,
  ServerContext,
} from '../../index'

export default function createRender(config: IntegralTorchConfig) {
  let routes: DraftRoute[] = getRoutes(config)

  if (!routes) {
    throw new Error('You need run `npm run build` before `npm start`!')
  }

  const router = createRouter(routes)

  return function (req: Request, res: Response, next: NextFunction) {
    const render = (element: ReactElement, state: object) => {
      const context: ClientContext = {
        ssr: config.ssr,
        env: process.env.NODE_ENV,
        side: 'client'
      }
      const data: DocumentProps = {
        title: config.title,
        publicPath: '',
        context,
        element,
        container: 'root',
        state,
        ...res.locals
      }
      const html = createHtml(data)
      const stream = ReactDOMServer.renderToStaticNodeStream(html)
      res.setHeader('Content-type', 'text/html')
      res.write('<!DOCTYPE html>')
      stream.pipe(res)
    }
    const context: ServerContext = {
      req,
      res,
      ssr: config.ssr,
      env: process.env.NODE_ENV,
      side: 'server'
    }
    router.tryRender(render, context, next)
  }
}