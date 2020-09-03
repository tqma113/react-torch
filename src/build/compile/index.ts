import getWebpackConfig from './webpackConfig'
import webpack from 'webpack'
import type { IntegralTorchConfig, PackContext } from '../../index'

export default function compileClient(
  config: IntegralTorchConfig,
  packContext: PackContext
) {
  const webpackConfig = config.webpack(getWebpackConfig(config), packContext)

  console.info(`Compiling client...`)

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
        console.info(`Compile client finish!\n`)

        resolve()
      }
    })
  })
}
