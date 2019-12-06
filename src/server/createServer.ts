import Koa from 'koa'
import viewEngine, { CustomT } from 'koa-react-view-typescript'
import { ViewProps } from '../view'
import { Config } from '../config'

export interface ServerCreator {
  (config: Config): Promise<Koa<Koa.DefaultState & ViewProps, Koa.DefaultContext & CustomT>>
}

const createServer: ServerCreator = async (config) => {
  let app = new Koa()

  app.use(require('koa-static')(config.public))

  let newApp = app.use(viewEngine<ViewProps>())

  return newApp
}

export default createServer