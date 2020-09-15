import getWebpackConfig from './webpackConfig'
import webpack from 'webpack'
import { step, info } from '../../lib/utils'
import type { IntegralTorchConfig, PackContext } from '../../index'

export default function compileClient(
  config: IntegralTorchConfig,
  packContext: PackContext
) {
  const webpackConfig = config.webpack(getWebpackConfig(config), packContext)

  step(`\nCompiling client...`)

  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (error, stats) => {
      if (error) {
        reject(error)
      } else {
        console.log(
          '[webpack:client:build]',
          stats.toString({
            colors: true,
          })
        )
        info(`\nCompile client finish!\n`)

        resolve()
      }
    })
  })
}
