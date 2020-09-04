import path from 'path'
import { hasModuleFile } from '../utils'
import { TORCH_DIR, TORCH_SERVER_DIR, TORCH_MDLW_FILE_NAME } from '../index'
import type { Server } from 'http'
import type { Application } from 'express'
import type { TorchConfig, Mdlw } from '../index'

export default function attachMiddleware(
  app: Application,
  server: Server,
  config: Required<TorchConfig>
) {
  if (config.mdlw) {
    const middlewarePath = path.resolve(
      config.dir,
      TORCH_DIR,
      TORCH_SERVER_DIR,
      TORCH_MDLW_FILE_NAME
    )

    if (hasModuleFile(middlewarePath)) {
      const middlewares: Record<string, Mdlw> = require(middlewarePath)

      Object.keys(middlewares).forEach((key) => {
        let middleware = middlewares[key]

        if (typeof middleware === 'function') {
          middleware(app, server)
        } else {
          console.warn(`The middelware: ${middleware} is not a function`)
        }
      })
    } else {
      console.warn(`The middelware module: ${config.mdlw} is invalid`)
    }
  }
}
