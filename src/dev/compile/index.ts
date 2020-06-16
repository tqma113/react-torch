import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import getWebpackConfig from './webpackConfig'
import reporter from './reporter'
import type { IntegralTorchConfig } from '../../index'

export default function compile(config: IntegralTorchConfig) {
  const webpackConfig = getWebpackConfig(config)
  const compiler = webpack(webpackConfig)
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