import path from 'path'
import createRouter from './router'
import getRoutes from './getRoutes'
import type { DraftRoute } from './router'
import type { Request, Response, NextFunction } from 'express'

export default function createRender(dir: string) {
  let routes: DraftRoute[] = getRoutes(dir)

  if (!routes) {
    throw new Error('You need run `npm run build` before `npm start`!')
  }

  const router = createRouter(routes)

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