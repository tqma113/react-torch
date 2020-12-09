import express from 'express'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import favicon from 'serve-favicon'
import helmet from 'helmet'
import bodyParser from 'body-parser'

import type { IntegralTorchConfig } from '../../index'

export default function createServer(config: IntegralTorchConfig) {
  const isDev = process.env.NODE_ENV === 'development'
  const loggerFormat = isDev ? 'dev' : 'common'
  const cookieParserSecret = isDev ? 'torch' : '__TORCH__'

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
  app.use(logger(loggerFormat))

  // body parser
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))

  // cookie parser
  app.use(cookieParser(cookieParserSecret))

  return app
}
