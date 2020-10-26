import path from 'path'
import webpack from 'webpack'
import getWebpackConfig from './webpackConfig'
import { error, warn } from '../../lib/utils'
import {
  TORCH_DIR,
  TORCH_SERVER_DIR,
  TORCH_ROUTES_FILE_NAME,
} from '../../index'
import type { Route } from '../../lib/router'
import type { IntegralTorchConfig, PackContext } from '../../index'

export default function compile(
  config: IntegralTorchConfig,
  packContext: PackContext,
  update: (routes: Route[]) => void
) {
  const webpackConfig = config.webpack(getWebpackConfig(config), packContext)
  const compiler = webpack(webpackConfig)

  return new Promise<void>((resolve, reject) => {
    const serverPath = path.join(config.dir, TORCH_DIR, TORCH_SERVER_DIR)
    compiler.watch({}, (err, stats) => {
      if (err) reject(err)

      if (stats) {
        const statsObj = stats.toJson()
        statsObj.errors.forEach(error)
        statsObj.warnings.forEach(warn)
        statsObj.assets?.forEach((asset: any) => {
          const assetPath = path.join(serverPath, asset.name)
          delete require.cache[require.resolve(assetPath)]
        })

        const routesPath = path.join(serverPath, TORCH_ROUTES_FILE_NAME)
        const newModule = require(routesPath)
        if (newModule) {
          const routes = newModule.default || newModule
          update(routes)
          resolve()
        } else {
          reject('cannot find routes')
        }
      }
    })
  })
}
