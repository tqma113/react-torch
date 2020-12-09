import webpack from 'webpack'

import getWebpackConfig from './webpackConfig'
import { step, info } from '../../lib/utils'

import type { IntegralTorchConfig, PackContext } from '../../index'

export default function compileClient(
  config: IntegralTorchConfig,
  packContext: PackContext
) {
  const webpackConfig = config.transformWebpackConfig(
    getWebpackConfig(config),
    packContext,
    config
  )

  step(`Compiling client...`)

  return new Promise<void>((resolve, reject) => {
    webpack(webpackConfig, (error, stats) => {
      if (error) {
        reject(error)
      }

      if (stats) {
        console.log(
          '[webpack:client:build]',
          stats.toString({
            colors: true,
          })
        )
        info(`Compile client finish!\n`)

        resolve()
      }
    })
  })
}
