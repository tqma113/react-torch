import fs from 'fs'
import path from 'path'
import webpack from 'webpack'

import getWebpackConfig from './webpackConfig'
import createCompiler from './createCompiler'
import { Side } from '../../index'

import type { Urls } from '../../internal/utils'
import type { IntegralTorchConfig, PackContext } from '../../index'

export default async function compile(config: IntegralTorchConfig, urls: Urls) {
  const packContext: PackContext = {
    ssr: config.ssr,
    env: process.env.NODE_ENV,
    packSide: Side.Client,
  }
  const webpackConfig = config.transformWebpackConfig(
    getWebpackConfig(config),
    packContext,
    config
  )

  const pkgPath = path.resolve(config.dir, 'package.json')
  const appName = require(pkgPath).name
  const yarnLockFilePath = path.resolve(config.dir, 'yarn.lock')
  const useYarn = fs.existsSync(yarnLockFilePath)

  // Create a webpack compiler that is configured with custom messages.
  return createCompiler({
    appName,
    config: webpackConfig,
    urls,
    useYarn,
    webpack,
  })
}
