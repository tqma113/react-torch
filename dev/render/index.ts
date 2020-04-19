import path from 'path'
import { Request, Response, NextFunction } from 'express'
import createRouter from './router/index';
import compile from './compile'

export default function render (dir: string) {
  const router = createRouter([])
  compile(dir, router)

  return function (req: Request, res: Response, next: NextFunction) {
    const render = (content: string) => {
      const data = {
        src: path.resolve(dir, '.torch', 'server', 'routes'),
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