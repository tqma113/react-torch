import express from 'express'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import favicon from 'serve-favicon'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import type { IntegralTorchConfig } from '../../index'

export default function createServer(config: IntegralTorchConfig) {
  const app = express()

  // helmet
  app.use(helmet())

  // compression
  app.use(compression())

  // favicon
  if (config.favicon) {
    app.use(favicon(config.favicon))
  }

  // logger
  app.use(logger('dev'))

  // body parser
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))

  // cookie parser
  app.use(cookieParser('torch'))

  return app
}
