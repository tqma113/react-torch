import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import getConfig from './config'
import reporter from './reporter'

export default function compile(dir: string) {
  const config = getConfig(dir)
  const compiler = webpack(config)
  const middleware = webpackDevMiddleware(compiler, {
    publicPath: 'static',
    stats: {
      chunks: false,
      colors: true
    },
    serverSideRender: true,
    writeToDisk: true,
    reporter
  })
  return [compiler, middleware] as const
}