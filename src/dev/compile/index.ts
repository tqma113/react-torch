import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import getWebpackConfig from './webpackConfig'
import reporter from './reporter'
import type { IntegralTorchConfig, PackContext } from '../../index'

export default function compile(config: IntegralTorchConfig, packContext: PackContext) {
  const webpackConfig = config.webpack(getWebpackConfig(config), packContext)
  const compiler = webpack(webpackConfig)
  const middleware = webpackDevMiddleware(compiler, {
    publicPath: 'static',
    stats: {
      chunks: false,
      colors: true,
    },
    writeToDisk: true,
    serverSideRender: true,
    reporter,
  })
  return [compiler, middleware] as const
}
