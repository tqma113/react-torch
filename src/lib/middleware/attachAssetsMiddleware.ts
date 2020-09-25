import { requireMiddleware } from '../utils'
import { warn } from '../utils'
import type { Server } from 'http'
import type { Application } from 'express'
import type { IntegralTorchConfig } from '../../index'

export const attachAssetsMiddleware = (
  app: Application,
  server: Server,
  config: IntegralTorchConfig
) => {
  if (config.middleware) {
    const middlewares = requireMiddleware(config)

    if (middlewares && middlewares.assets) {
      middlewares.assets(app, server)
    } else {
      warn(`The middelwares module: ${config.middleware} is invalid`)
    }
  }
}
