import Koa from 'koa'

export const createApp = () => {
  const app = new Koa()

  app.use(async ctx => {
    ctx.body = 'Hello World!'
  })

  return app
}