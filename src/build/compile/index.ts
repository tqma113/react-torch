import webpack from 'webpack'

import getWebpackConfig from './webpackConfig'
import { step, info } from '../../internal/utils'

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

  step(`\nCompiling client...`)

  return new Promise<void>((resolve, reject) => {
    webpack(webpackConfig, (error, stats) => {
      if (error) {
        reject(error)
      } else {
        console.log(
          '[webpack:client:build]',
          stats!.toString({
            colors: true,
          })
        )
        info(`\nCompile client finish!\n`)

        resolve()
      }
    })
  })
}
