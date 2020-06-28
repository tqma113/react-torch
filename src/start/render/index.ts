import createRouter from './router'
import getRoutes from './getRoutes'
import type { DraftRoute } from './router'
import type { Request, Response, NextFunction } from 'express'
import type {
  IntegralTorchConfig,
  ClientContext,
  ServerContext,
  RenderData
} from '../../index'

export default function createRender(config: IntegralTorchConfig) {
  let routes: DraftRoute[] = getRoutes(config)

  if (!routes) {
    throw new Error('You need run `npm run build` before `npm start`!')
  }

  const router = createRouter(routes)

  return function (req: Request, res: Response, next: NextFunction) {
    const render = (content: string, state: object) => {
      const context: ClientContext = {
        ssr: config.ssr,
        env: process.env.NODE_ENV,
        side: 'client'
      }
      const data: RenderData = {
        title: config.title,
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