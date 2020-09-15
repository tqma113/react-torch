import webpack from 'webpack'
import getWebpackConfig from './webpackConfig'
import { step, info } from '../../lib/utils'
import type { IntegralTorchConfig, PackContext } from '../../index'

export default function compileServer(
  config: IntegralTorchConfig,
  packContext: PackContext
) {
  const webpackConfig = config.webpack(getWebpackConfig(config), packContext)

  step(`\nCompiling server...`)

  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (error, stats) => {
      if (error) {
        reject(error)
      } else {
        console.log(
          '[webpack:server:build]',
          stats.toString({
            colors: true,
          })
        )
        info(`Compile server finish!\n`)

        resolve()
      }
    })
  })
}
