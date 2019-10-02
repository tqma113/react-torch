import Koa from 'koa'
import viewEngine, { CustomT } from 'koa-react-view-typescript'
import { ViewProps } from '../index'
import { Config } from '../config'

export interface ServerCreator {
  (config: Config): Promise<Koa<Koa.DefaultState & ViewProps, Koa.DefaultContext & CustomT>>
}

const createServer: ServerCreator = async (config) => {
  const app = new Koa().use(viewEngine<ViewProps>())

  app.use(viewEngine())

  return app
}

export default createServer