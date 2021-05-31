/// <reference path="../global.d.ts" />

import path from 'path'
import http from 'http'
import debug from 'debug'
import express from 'express'
import ReactDOMServer from 'react-dom/server'
import webpackDevMiddleware from 'webpack-dev-middleware'

import { mergeConfig } from '../internal/config'
import { pureDevTorch } from './index'
import createDefaultServer from '../internal/server'
import { info, error as errorlog, openBrowser } from '../internal/utils'
import {
  injectMiddleware,
  injectAssetsMiddleware,
} from '../internal/middleware'
import {
  TORCH_DIR,
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

export function createDevServer(draftConfig: TorchConfig) {
  return new Promise<Result>(async (resolve, reject) => {
    const config = mergeConfig(draftConfig)
    const torch = await pureDevTorch(config)
    const createServer = config.createServer || createDefaultServer
    const app = createServer(config)
    const server = http.createServer(app)

    // custome middlewares
    injectMiddleware(app, server, config)

    if (torch.compiler) {
      const middleware = webpackDevMiddleware(torch.compiler, {
        publicPath: 'static',
        writeToDisk: true,
        serverSideRender: true,
      })
      const hotMiddleware = require(`webpack-hot-middleware`)(torch.compiler, {
        log: false,
        quiet: true,
        noInfo: true,
      })
      const assetsMiddleware: RequestHandler = (req, res, next) => {
        res.locals.assets = res.locals.webpack.devMiddleware.stats.assets
        next()
      }
      app.use(middleware)
      app.use(hotMiddleware)
      app.use(assetsMiddleware)
    } else {
      const assetsMiddleware: RequestHandler = (req, res, next) => {
        const assertPath = path.resolve(
          config.dir,
          TORCH_DIR,
          TORCH_CLIENT_DIR,
          TORCH_PUBLIC_PATH,
          TORCH_ASSETS_FILE_NAME
        )
        res.locals.assets = getAssets(require(assertPath))
        next()
      }
      app.use(assetsMiddleware)
    }

    // static file route
    app.use('/', express.static(torch.static()))

    // static file route
    if (torch.public) {
      app.use('/', express.static(torch.public()))
    }

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
