import { Middleware } from '../../src'

export const attachCss: Middleware = (app, server) => {
  app.use((req, res, next) => {
    res.locals = {
      styles: [
        {
          type: 'link',
          href: '/css/test.css',
          preload: true,
        },
      ],
    }
    next()
  })
}
