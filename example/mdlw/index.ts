import type { Mdlw } from '../../src'

export { attachCss } from './attachCss'

export const foo: Mdlw = (app, server) => {
  app.use((req, res, next) => {
    // console.log(req.url)
    next()
  })
}
