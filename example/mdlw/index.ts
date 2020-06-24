import type { Mdlw } from '../../src'

export const foo: Mdlw = (app, server) => {
  app.use((req, res, next) => {
    console.log(req.url)
    next()
  })
}