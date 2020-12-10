/// <reference path="../global.d.ts" />

import http from 'http'
import debug from 'debug'

import { mergeConfig } from '../internal/config'
import { createApp } from './createApp'
import createDefaultServer from '../internal/server'
import { info, error as errorlog, openBrowser } from '../internal/utils'
import {
  injectMiddleware,
  injectAssetsMiddleware,
} from '../internal/middleware'

import type express from 'express'
import type { TorchConfig } from '../index'

export type Result = {
  server: http.Server
  app: express.Express
}

export default function (draftConfig: TorchConfig) {
  return new Promise<Result>(async (resolve, reject) => {
    const config = mergeConfig(draftConfig)
    const torch = await createApp(config)
    const createServer = config.createServer || createDefaultServer
    const app = createServer(config)
    const server = http.createServer(app)

    // custome middlewares
    injectMiddleware(app, server, config)

    if (torch.devMiddleware) {
      app.use(torch.devMiddleware)
    }

    // static file route
    app.use('/', torch.static())

    // static file route
    if (torch.public) {
      app.use('/', torch.public())
    }

    if (torch.hotMiddleware) {
      app.use(torch.hotMiddleware)
    }

    // assets middleware
    app.use(torch.assetsMiddleware)

    // custome assets middlewares
    injectAssetsMiddleware(app, server, config)

    // page router
    app.use(torch.render)

    // Event listener for HTTP server "listening" event.
    const onListening = () => {
      const addr = server.address()
      const bind =
        typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port
      debug(`Listening on ${bind}`)
      if (torch.urls) {
        openBrowser(torch.urls.localUrlForBrowser)
      } else {
        info('Listening on ' + bind)
      }
    }

    // Event listener for HTTP server "error" event.
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

    // Listen on provided port, on all network interfaces.
    server.listen(config.port)
    server.on('error', onError)
    server.on('listening', onListening)
    server.on('error', reject)
    server.on('listening', () => resolve({ server, app }))
  })
}
