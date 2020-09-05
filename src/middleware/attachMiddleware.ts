import { requireMiddleware } from './index'
import type { Server } from 'http'
import type { Application } from 'express'
import type { IntegralTorchConfig } from '../index'

export const attachMiddleware = (
  app: Application,
  server: Server,
  config: IntegralTorchConfig
) => {
  if (config.middlewares) {
    const middlewares = requireMiddleware(config)

    if (middlewares) {
      Object.keys(middlewares).forEach((key) => {
        if (key === 'assets') {
          return
        }
        
        const middleware = middlewares[key]
        if (typeof middleware === 'function') {
          middleware(app, server)
        } else {
          console.warn(`The middelware: ${key} is not a function`)
        }
      })
    } else {
      console.warn(`The middelwares module: ${config.middlewares} is invalid`)
    }
  }
}
