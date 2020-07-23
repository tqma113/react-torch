/// <reference path="../torch.d.ts" />

process.env.NODE_ENV = 'production'

import path from 'path'
import http from 'http'
import debug from 'debug'
import express from 'express'
import createServer from './server'
import createRender from './render'
import attachMiddleware from './attachMiddleware'
import { mergeConfig } from '../config'
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
  attachMiddleware(app, server, config)

  // static file route
  app.use(
    '/__torch',
    express.static(path.resolve(config.dir, '.torch', 'client'))
  )

  // static file route
  app.use(
    '/static',
    express.static(path.resolve(config.dir, '.torch', 'public'))
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