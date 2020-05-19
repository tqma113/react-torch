import path from 'path'
import createRouter from './router/index';
import compile from './compile'
import type { Request, Response, NextFunction } from 'express'
import type { IntegralTorchConfig } from 'type'

export default function createRender (config: IntegralTorchConfig) {
  const router = createRouter([])
  compile(config, router)

  return function (req: Request, res: Response, next: NextFunction) {
    const render = (content: string) => {
      const data = {
        src: path.resolve(config.dir, '.torch', 'server', 'routes'),
        publicPath: '/static',
        ssr: true,
        content,
        container: 'root'
      }
      res.render('view', data)
    }
    router.tryRender(req.url, render, next)
  }
}