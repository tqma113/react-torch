import path from 'path'
import { babelConfig } from '../../config'
import { getExternals, hasModuleFile } from './utils'
import type { Configuration } from 'webpack'
import type { IntegralTorchConfig, ServerEntry } from '../../index'

export default function getConfig(config: IntegralTorchConfig): Configuration {
  let entry: ServerEntry = {
    routes: config.src,
    view: path.resolve(__dirname, '../view'),
  }

  if (config.mdlw) {
    if (hasModuleFile(config.mdlw)) {
      entry.mdlw = config.mdlw
    } else {
      console.warn(`The middleware path: ${config.mdlw} is invalid.`)
    }
  }

  return {
    target: 'node',
    mode: 'development',
    watch: true,
    context: config.src,
    // @ts-ignore
    entry,
    output: {
			path: path.join(config.dir, '.torch', 'server'),
      filename: '[name].js',
			libraryTarget: 'commonjs2'
    },
    devtool: 'source-map',
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            ...babelConfig,
            cacheDirectory: true
          }
        }
      ]
    },
    optimization: {
      minimize: false
    },
    performance: {
      hints: 'warning',
      maxEntrypointSize: 400000,
    },
    resolve: {
      modules: ['node_modules'],
      extensions: ['.js', '.jsx', '.json', '.mjs', '.ts', '.tsx']
    },
    externals: getExternals(config.dir)
  }
}