import webpack from 'webpack'
import getWebpackConfig from './webpackConfig'
import type { IntegralTorchConfig } from '../../index'

export default function compileServer(config: IntegralTorchConfig) {
  const webpackConfig = getWebpackConfig(config)

  console.info(`Compiling server...`)

  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (error, stats) => {
      if (error) {
        reject(error)
      } else {
        console.log(
          '[webpack:server:build]',
          stats.toString({
            colors: true
          })
        )
        console.info(`Compile server finish!\n`)

        resolve()
      }
    })
  })
}
