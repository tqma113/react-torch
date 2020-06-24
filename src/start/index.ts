/// <reference path="../torch.d.ts" />

import path from 'path'
import http from 'http'
import debug from 'debug'
import express from 'express'
import createServer from './server'
import createRender from './render'
import { mergeConfig } from '../config'
import { hasModuleFile } from './render/utils'
import type { TorchConfig } from '../index'

export type Result = {
  server: http.Server,
  app: express.Express
}

export default function start(draftConfig: TorchConfig) {
  const config = mergeConfig(draftConfig)

  const app = createServer(config.dir)
  const server = http.createServer(app)
  const render = createRender(config)

  // custome middlewares
  if (config.mdlw) {
    const middlewarePath = path.resolve(config.dir, '.torch', 'server', 'mdlw.js')
    if (hasModuleFile(middlewarePath)) {
      let middlewares = require(middlewarePath)
      middlewares = middlewares.default || middlewares
      Object.keys(middlewares).forEach(key => {
        let middleware = middlewares[key]
        if (typeof middleware === 'function') {
          middleware(app, server)
        }
      })
    }
  }

  // static file route
  app.use(
    '/static',
    express.static(path.resolve(config.dir, '.torch', 'client'))
  )

  // static assets
  app.use((req, res, next) => {
    const assertPath = path.resolve(config.dir, '.torch', 'client', 'assets.json')
    res.locals.assets = require(assertPath)
    next()
  })

  // page router
  app.use(render)
  
  // error handler
  const errorHandler: express.ErrorRequestHandler 
    = (err: any, req, res, next) => {
    res.status(err.status || 500)
    res.json(err.message)
  }
  app.use(errorHandler)

  return new Promise<Result>((resolve, reject) => {
		/**
		 * Event listener for HTTP server "listening" event.
		 */
    const onListening = () => {
      let addr = server.address()
			let bind = typeof addr === 'string' 
				? 'pipe ' + addr 
				: 'port ' + addr?.port
      debug('Listening on ' + bind)
      console.log('Listening on ' + bind)
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
          console.error(config.port + ' requires elevated privileges')
          process.exit(1)
          break
        case 'EADDRINUSE':
          console.error(config.port + ' is already in use')
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