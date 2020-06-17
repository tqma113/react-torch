import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import getWebpackConfig from './webpackConfig'
import reporter from './reporter'
import { getMFS } from '../mfs'
import type { IntegralTorchConfig } from '../../index'

export default function compile(config: IntegralTorchConfig) {
  const webpackConfig = getWebpackConfig(config)
  const compiler = webpack(webpackConfig)
  const mfs = getMFS()
  const middleware = webpackDevMiddleware(compiler, {
    publicPath: 'static',
    stats: {
      chunks: false,
      colors: true
    },
    fs: mfs,
    serverSideRender: true,
    reporter
  })
  return [compiler, middleware] as const
}