import type { Middleware } from '../../src'

export { attachCss } from './attachCss'

export const assets: Middleware = (app, server) => {
  app.use((req, res, next) => {
    next()
  })
}
