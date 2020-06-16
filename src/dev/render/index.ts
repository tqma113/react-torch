import path from 'path'
import createRouter from './router/index';
import compile from './compile'
import type { Request, Response, NextFunction } from 'express'
import type { IntegralTorchConfig } from '../../index'

export default function createRender (config: IntegralTorchConfig) {
  const router = createRouter([])
  compile(config, router)

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
    router.tryRender(render, req, res, next)
  }
}