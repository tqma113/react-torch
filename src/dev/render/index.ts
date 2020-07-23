import ReactDOMServer from 'react-dom/server'
import createRouter from './router/index';
import compile from './compile'
import createHtml from '../../document'
import type { ReactElement } from 'react';
import type { Request, Response, NextFunction } from 'express'
import type { DocumentProps } from '../../document'
import type {
  IntegralTorchConfig,
  ServerContext,
  ClientContext,
} from '../../index'

export default async function createRender (config: IntegralTorchConfig) {
  const router = createRouter([])
  await compile(config, router)

  return function (req: Request, res: Response, next: NextFunction) {
    const render = (element: ReactElement, state: object) => {
      const context: ClientContext = {
        ssr: config.ssr,
        env: process.env.NODE_ENV,
        side: 'client'
      }
      const data: DocumentProps = {
        title: config.title,
        publicPath: '/__torch',
        context,
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