import getWebpackConfig from './webpackConfig'
import webpack from 'webpack'
import type { IntegralTorchConfig } from '../../index'

export default function compileClient(config: IntegralTorchConfig) {
  const webpackConfig = getWebpackConfig(config)

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
