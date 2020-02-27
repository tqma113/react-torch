import express from 'express'
import { ViewProps } from './view'
import babel from '../../compile/babel'
import { Config } from '../../config'

export interface ServerCreator {
  (config: Config): Promise<express.Express>
}

const createServer: ServerCreator = async (config) => {
  const app = express()

  // render views
  const viewsConfig = {
    babel
  }

  app.engine("js", require("express-react-views").createEngine(viewsConfig))
	app.engine("jsx", require("express-react-views").createEngine(viewsConfig))
	app.engine("ts", require("express-react-views").createEngine(viewsConfig))
	app.engine("tsx", require("express-react-views").createEngine(viewsConfig))
  app.set("view engine", "tsx") // default view engine ext .js
  
  // page request handle
  app.use((req, res, next) => {
    const viewProps: ViewProps = {
      
    }
    res.render('index', )
  })

  return app
}

export default createServer
