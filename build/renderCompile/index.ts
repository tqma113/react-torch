import webpack from 'webpack'
import getWebpackConfig from './webpackConfig'
import type { IntegralTorchConfig } from 'type'

export default function compileServer(config: IntegralTorchConfig) {
  const webpackConfig = getWebpackConfig(config)
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
        resolve()
      }
    })
  })
}
