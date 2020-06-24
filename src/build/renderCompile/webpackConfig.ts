import path from 'path'
import { babelConfig } from '../../config'
import { getExternals } from './utils'
import type { Configuration } from 'webpack'
import type { IntegralTorchConfig } from '../../index'

export type ServerEntry = {
  app: string,
  routes: string,
  view: string,
  mdlw?: string
}

export default function getConfig(config: IntegralTorchConfig): Configuration {
  let entry: ServerEntry = {
    routes: config.src,
    view: path.resolve(__dirname, '../view'),
    app: path.resolve(__dirname, '../app'),
  }

  if (config.mdlw) {
    if (hasModuleFile(config.mdlw)) {
      entry.mdlw = config.mdlw
    }
  }

  return {
    target: 'node',
    mode: 'production',
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
      minimize: true
    },
    performance: {
      hints: 'error',
      maxEntrypointSize: 400000,
    },
    resolve: {
      modules: ['node_modules'],
      extensions: ['.js', '.jsx', '.json', '.mjs', '.ts', '.tsx']
    },
    externals: getExternals(config.dir)
  }
}

export function hasModuleFile(filename: string): boolean {
	try {
		return !!require.resolve(filename)
	} catch (_) {
		return false
	}
}