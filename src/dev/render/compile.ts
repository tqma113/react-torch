import path from 'path'
import webpack from 'webpack'
import getWebpackConfig from './webpackConfig'
import type { IntegralTorchConfig, PackContext } from '../../index'

export default function compile(config: IntegralTorchConfig, packContext: PackContext) {
  const webpackConfig = config.webpack(getWebpackConfig(config), packContext)
  const compiler = webpack(webpackConfig)

  return new Promise<never>((resolve, reject) => {
    compiler.watch({}, (err, stats) => {
      if (err) reject(err)

      const statsObj = stats.toJson()
      statsObj.errors.forEach(console.error)
      statsObj.warnings.forEach(console.warn)

      const outputPath = path.join(config.dir, '.torch', 'server', 'routes.js')
      const newModule = require(outputPath)
      if (newModule) {
        const routes = newModule.default || newModule
        resolve(routes)
      } else {
        reject('cannot find routes')
      }
    })
  })
}
