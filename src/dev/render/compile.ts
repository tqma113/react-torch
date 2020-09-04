import path from 'path'
import webpack from 'webpack'
import getWebpackConfig from './webpackConfig'
import {
  TORCH_DIR,
  TORCH_SERVER_DIR,
  TORCH_ROUTES_FILE_NAME,
} from '../../index'
import type { DraftRoute } from '../../router'
import type { IntegralTorchConfig, PackContext } from '../../index'

export default function compile(
  config: IntegralTorchConfig,
  packContext: PackContext,
  update: (routes: DraftRoute[]) => void
) {
  const webpackConfig = config.webpack(getWebpackConfig(config), packContext)
  const compiler = webpack(webpackConfig)

  return new Promise<void>((resolve, reject) => {
    compiler.watch({}, (err, stats) => {
      if (err) reject(err)

      const statsObj = stats.toJson()
      statsObj.errors.forEach(console.error)
      statsObj.warnings.forEach(console.warn)

      const outputPath = path.join(
        config.dir,
        TORCH_DIR,
        TORCH_SERVER_DIR,
        TORCH_ROUTES_FILE_NAME
      )
      const newModule = require(outputPath)
      if (newModule) {
        const routes = newModule.default || newModule
        update(routes)
        resolve()
      } else {
        reject('cannot find routes')
      }
    })
  })
}
