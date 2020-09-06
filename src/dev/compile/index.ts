import fs from 'fs'
import path from 'path'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import getWebpackConfig from './webpackConfig'
import prepareUrls from './prepareUrls'
import createCompiler from './createCompiler'
import type { IntegralTorchConfig, PackContext } from '../../index'

export default async function compile(
  config: IntegralTorchConfig,
  packContext: PackContext,
) {
  const webpackConfig = config.webpack(getWebpackConfig(config), packContext)

  const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
  const pkgPath = path.resolve(config.dir, 'package.json')
  const appName = require(pkgPath).name
  const yarnLockFilePath = path.resolve(config.dir, 'yarn.lock')
  const useYarn = fs.existsSync(yarnLockFilePath)
  const urls = prepareUrls(protocol, config.host, config.port)
  // Create a webpack compiler that is configured with custom messages.
  const compiler = createCompiler({
    appName,
    config: webpackConfig,
    urls,
    useYarn,
    webpack,
  })
  const middleware = webpackDevMiddleware(compiler, {
    publicPath: 'static',
    stats: {
      chunks: false,
      colors: true,
    },
    writeToDisk: true,
    serverSideRender: true,
  })
  return [compiler, middleware] as const
}
