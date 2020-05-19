import getWebpackConfig from './webpackConfig'
import webpack from 'webpack'
import type { IntegralTorchConfig } from 'type'

export default function compileClient(config: IntegralTorchConfig) {
  const webpackConfig = getWebpackConfig(config)
  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (error, stats) => {
      if (error) {
        reject(error)
      } else {
        console.log(
          '[webpack:client:build]',
          stats.toString({
            colors: true
          })
        )
        resolve()
      }
    })
  })
}
