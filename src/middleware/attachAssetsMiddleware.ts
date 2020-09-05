import { requireMiddleware } from './index'
import type { Server } from 'http'
import type { Application } from 'express'
import type { IntegralTorchConfig } from '../index'

export const attachAssetsMiddleware = (
  app: Application,
  server: Server,
  config: IntegralTorchConfig
) => {
  if (config.middlewares) {
    const middlewares = requireMiddleware(config)

    if (middlewares && middlewares.assets) {
      middlewares.assets(app, server)
    } else {
      console.warn(`The middelwares module: ${config.middlewares} is invalid`)
    }
  }
}
