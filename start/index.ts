import path from 'path'
import http from 'http'
import debug from 'debug'
import express from 'express'
import createServer from './server'
import render from './render'

export type Result = {
  server: http.Server,
  app: express.Express
}

const PORT = '80'

export default function start(_dir: string, _port?: string) {
  const dir = _dir
    ? path.resolve(process.cwd(), _dir)
    : process.cwd()
  const port = _port || PORT

  const app = createServer(dir)
  const server = http.createServer(app)

  // static file route
  app.use(
    '/static',
    express.static(path.resolve(dir, '.torch', 'client'))
  )

  // static assets
  app.use((req, res, next) => {
    const assertPath = path.resolve(dir, '.torch', 'client', 'assets.json')
    res.locals.assets = require(assertPath)
    next()
  })

  // page router
  app.use(render(dir))
  
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
          console.error(PORT + ' requires elevated privileges')
          process.exit(1)
          break
        case 'EADDRINUSE':
          console.error(PORT + ' is already in use')
          process.exit(1)
          break
        default:
          throw error
      }
    }

		/**
		 * Listen on provided port, on all network interfaces.
		 */
		server.listen(port)
		server.on('error', onError)
		server.on('listening', onListening)
		server.on('error', reject)
		server.on('listening', () => resolve({ server, app }))
	})
}