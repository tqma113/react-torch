import path from 'path'
import createRouter from './router/index';
import compile from './compile'
import type { Request, Response, NextFunction } from 'express'
import type { IntegralTorchConfig, ServerContext, ClientContext } from '../../index'

export default async function createRender (config: IntegralTorchConfig) {
  const router = createRouter([])
  await compile(config, router)

  return function (req: Request, res: Response, next: NextFunction) {
    const render = (content: string, state: object) => {
      const context: ClientContext = {
        ssr: config.ssr,
        env: process.env.NODE_ENV,
        side: 'client'
      }
      const data = {
        src: path.resolve(config.dir, '.torch', 'server', 'routes'),
        publicPath: '/__torch',
        context,
        content,
        container: 'root',
        state
      }
      res.render('view', data)
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