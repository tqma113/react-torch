/// <reference path="../torch.d.ts" />

import path from 'path'
import http from 'http'
import debug from 'debug'
import express from 'express'
import createServer from './server'
import compile from './compile'
import createRender from './render'
import { attachMiddleware, attachAssetsMiddleware } from '../middleware'
import { mergeConfig } from '../config'
import { rmTorchProjectFiles, error as errorlog, choosePort } from '../utils'
import {
  Env,
  Side,
  TORCH_DIR,
  TORCH_CLIENT_DIR,
  TORCH_PUBLIC_DIR,
} from '../index'
import type { TorchConfig, TinyContext, PackContext } from '../index'

export type Result = {
  server: http.Server
  app: express.Express
}

export default function dev(draftConfig: TorchConfig) {
  process.env.NODE_ENV = Env.Development
  const config = mergeConfig(draftConfig)

  return new Promise<Result>(async (resolve, reject) => {
    const port = await choosePort(config.host, config.port)
    if (port === null) {
      // We have not found a port.
      process.exit(1)
    } else {
      config.port = port
    }
    
    const tinyContext: TinyContext = {
      ssr: config.ssr,
      env: process.env.NODE_ENV,
    }
    const clientContext: PackContext = {
      ...tinyContext,
      packSide: Side.Client,
    }
    const serverContext: PackContext = {
      ...tinyContext,
      packSide: Side.Server,
    }
  
    // remove before
    rmTorchProjectFiles(config.dir)
  
    // start
    const app = createServer(config.dir)
    const server = http.createServer(app)

    const render = await createRender(config, serverContext)

    // custome middlewares
    attachMiddleware(app, server, config)

    // client compile
    const [compiler, middleware] = await compile(config, clientContext)
    app.use(middleware)

    // client compiled static file route
    app.use(
      '/__torch',
      express.static(path.resolve(config.dir, TORCH_DIR, TORCH_CLIENT_DIR))
    )

    // static file route
    app.use(
      '/static',
      express.static(path.resolve(config.dir, TORCH_PUBLIC_DIR))
    )

    // webpack-hot-middleware
    app.use(
      require(`webpack-hot-middleware`)(compiler, {
        log: false,
        quiet: true,
        noInfo: true,
      })
    )

    // 开发模式用 webpack-dev-middleware 获取 assets
    app.use((req, res, next) => {
      res.locals.assets = getAssets(
        res.locals.webpackStats.toJson().assetsByChunkName
      )
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
      debug(`Listening on ${bind}`)
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
  return Object.keys(stats).reduce((result, assetName) => {
    const value = stats[assetName]
    result[assetName] = Array.isArray(value) ? value[0] : value
    return result
  }, {} as Record<string, string>)
}
