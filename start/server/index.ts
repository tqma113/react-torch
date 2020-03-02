import path from 'path'
import express from 'express'
import logger from "morgan"
import cookieParser from 'cookie-parser'
import compression from 'compression'
// import favicon from 'serve-favicon'
import helmet from 'helmet'
import bodyParser from 'body-parser'

export default function createServer(dir: string) {
  const app = express()

  // helmet
  app.use(helmet())

  // compression
  app.use(compression())

  // favicon
  // app.use(favicon(dir))

  // view engine
  const viewsConfig = {
		babel: {
			extensions: [".js"]
		}
	}
  app.engine("js", require("express-react-views").createEngine(viewsConfig))

  // view engine setup
	app.set("views", path.resolve(dir, '.torch', 'server'))
  app.set("view engine", "js")
  
  // logger
  app.use(logger('common'))

  // body parser
  app.use(bodyParser())
  app.use(bodyParser.urlencoded())

  // cookie parser
  app.use(cookieParser('torch'))

  return app
}