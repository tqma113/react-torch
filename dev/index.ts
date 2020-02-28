import path from 'path'
import express from 'express'
import querystring from 'query-string'
import createServer from './server'
import compile from './compile'
import render from './render'

const PORT = '3000'

export default function dev(dir: string) {
  const app = createServer(dir)

  // client compile
  const [compiler, middleware] = compile(dir)
  app.use(middleware)

  // webpack-hot-middleware
  const whmConfig = {
    quiet: true,
    noInfo: true
  }
  app.use(
    require(`webpack-hot-middleware?${querystring.stringify(
      whmConfig
    )}`)(compiler, {
      log: false
    })
  )

  // static file route
  app.use(
    '/static',
    express.static(path.resolve(dir, 'src'))
  )

  // 开发模式用 webpack-dev-middleware 获取 assets
  app.use((req, res, next) => {
    res.locals.assets = getAssets(
      res.locals.webpackStats.toJson().assetsByChunkName
    )
    next()
  })

  // page router
  app.use(render(dir))
  

  return app
}

function getAssets(stats: Record<string, any>): Record<string, any> {
	return Object.keys(stats).reduce((result, assetName) => {
		let value = stats[assetName]
		result[assetName] = Array.isArray(value) ? value[0] : value
		return result
	}, {} as Record<string, any>)
}