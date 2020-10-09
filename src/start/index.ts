/// <reference path="../global.d.ts" />

import path from 'path'
import http from 'http'
import debug from 'debug'
import express from 'express'
import createServer from './server'
import createRender from './render'
import { attachMiddleware, attachAssetsMiddleware } from '../lib/middleware'
import { mergeConfig } from '../lib/config'
import { info, error as errorlog, choosePort } from '../lib/utils'
import {
  Env,
  TORCH_DIR,
  TORCH_CLIENT_DIR,
  TORCH_PUBLIC_DIR,
  TORCH_ASSETS_FILE_NAME,
} from '../index'
import type { TorchConfig } from '../index'

export type Result = {
  server: http.Server
  app: express.Express
}

export default function start(draftConfig: TorchConfig) {
  process.env.NODE_ENV = Env.Production
  const config = mergeConfig(draftConfig)

  return new Promise<Result>(async (resolve, reject) => {
    const port = await choosePort(config.host, config.port)
    if (port === null) {
      // We have not found a port.
      process.exit(1)
    } else {
      config.port = port
    }

    const app = createServer(config)
    const server = http.createServer(app)
    const render = createRender(config)

    // custome middlewares
    attachMiddleware(app, server, config)

    // static file route
    app.use(
      '/__torch',
      express.static(path.resolve(config.dir, TORCH_DIR, TORCH_CLIENT_DIR))
    )

    // static file route
    app.use(
      '/',
      express.static(path.resolve(config.dir, TORCH_DIR, TORCH_PUBLIC_DIR))
    )

    // static assets
    app.use((req, res, next) => {
      const assertPath = path.resolve(
        config.dir,
        TORCH_DIR,
        TORCH_CLIENT_DIR,
        TORCH_ASSETS_FILE_NAME
      )
      res.locals.assets = getAssets(require(assertPath))
      next()
    })

    // custome assets middlewares
    attachAssetsMiddleware(app, server, config)

    // page router
    app.use(render)

    // error handler
    const errorHandler: express.ErrorRequestHandler = (
      err: any,
      req,
      res,
      next
    ) => {
      res.status(err.status || 500)
      res.json(err.message)
    }
    app.use(errorHandler)

    /**
     * Event listener for HTTP server "listening" event.
     */
    const onListening = () => {
      let addr = server.address()
      let bind =
        typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port
      debug('Listening on ' + bind)
      info('Listening on ' + bind)
    }

    /**
     * Event listener for HTTP server "error" event.
     */
    const onError = (error: any) => {
      if (error.syscall !== 'listen') {
        throw error
      }

      // handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          errorlog(config.port + ' requires elevated privileges')
          process.exit(1)
          break
        case 'EADDRINUSE':
          errorlog(config.port + ' is already in use')
          process.exit(1)
          break
        default:
          throw error
      }
    }

    /**
     * Listen on provided port, on all network interfaces.
     */
    server.listen(config.port)
    server.on('error', onError)
    server.on('listening', onListening)
    server.on('error', reject)
    server.on('listening', () => resolve({ server, app }))
  })
}

function getAssets(stats: Record<string, string | string[]>) {
  return Object.keys(stats).reduce(
    (result: Record<string, string>, assetName) => {
      const value = stats[assetName]
      result[assetName] = Array.isArray(value) ? value[0] : value
      return result
    },
    {}
  )
}
