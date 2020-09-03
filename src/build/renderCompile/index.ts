import webpack from 'webpack'
import getWebpackConfig from './webpackConfig'
import type { IntegralTorchConfig, PackContext } from '../../index'

export default function compileServer(config: IntegralTorchConfig, packContext: PackContext) {
  const webpackConfig = config.webpack(getWebpackConfig(config), packContext)

  console.info(`Compiling server...`)

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
        console.info(`Compile server finish!\n`)

        resolve()
      }
    })
  })
}
