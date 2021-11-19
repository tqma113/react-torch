/// <reference path="../global.d.ts" />

import path from 'path'
import http from 'http'
import debug from 'debug'
import express from 'express'
import ReactDOMServer from 'react-dom/server'

import { mergeConfig } from '../internal/config'
import { pureTorch } from './index'
import createDefaultServer from '../internal/server'
import { info, error as errorlog } from '../internal/utils'
import {
  injectMiddleware,
  injectAssetsMiddleware,
} from '../internal/middleware'
import {
  OUTPUT_DIR,
  TORCH_CLIENT_DIR,
  TORCH_PUBLIC_PATH,
  TORCH_ASSETS_FILE_NAME,
} from '../index'

import type { Express, RequestHandler } from 'express'
import type { TorchConfig } from '../index'

export type Result = {
  server: http.Server
  app: Express
}

export function createServer(draftConfig: TorchConfig) {
  return new Promise<Result>(async (resolve, reject) => {
    const config = mergeConfig(draftConfig)
    const torch = await pureTorch(config)
    const createServer = config.createServer || createDefaultServer
    const app = createServer(config)
    const server = http.createServer(app)

    // custome middlewares
    injectMiddleware(app, server, config)

    const assetsMiddleware: RequestHandler = (req, res, next) => {
      const assertPath = path.resolve(
        config.dir,
        OUTPUT_DIR,
        TORCH_CLIENT_DIR,
        TORCH_PUBLIC_PATH,
        TORCH_ASSETS_FILE_NAME
      )
      res.locals.assets = getAssets(require(assertPath))
      next()
    }
    app.use(assetsMiddleware)

    // static file route
    app.use(express.static(torch.static()))

    // custome assets middlewares
    injectAssetsMiddleware(app, server, config)

    // page router
    app.use(async (req, res) => {
      const url = req.url
      const assets = res.locals.assets
      const scripts = res.locals.scripts
      const styles = res.locals.styles
      const html = await torch.render({
        url,
        assets,
        scripts,
        styles,
        others: {},
      })
      const stream = ReactDOMServer.renderToNodeStream(html)

      res.status(200)
      res.setHeader('Content-type', 'text/html')
      res.write('<!DOCTYPE html>')
      stream.pipe(res)
    })

    // Event listener for HTTP server "listening" event.
    const onListening = () => {
      const addr = server.address()
      const bind =
        typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port
      debug(`Listening on ${bind}`)
      info('Listening on ' + bind)
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
