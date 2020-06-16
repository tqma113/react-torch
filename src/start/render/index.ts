import path from 'path'
import createRouter from './router'
import getRoutes from './getRoutes'
import type { DraftRoute } from './router'
import type { Request, Response, NextFunction } from 'express'
import type { IntegralTorchConfig } from '../../index'

export default function createRender(config: IntegralTorchConfig) {
  let routes: DraftRoute[] = getRoutes(config)

  if (!routes) {
    throw new Error('You need run `npm run build` before `npm start`!')
  }

  const router = createRouter(routes)

  return function (req: Request, res: Response, next: NextFunction) {
    const render = (content: string, state: object) => {
      const data = {
        src: path.resolve(config.dir, '.torch', 'server', 'routes'),
        publicPath: '/static',
        ssr: config.ssr,
        content,
        container: 'root',
        state
      }
      res.render('view', data)
    }
    router.tryRender(req.url, render, next)
  }
}