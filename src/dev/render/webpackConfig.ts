import path from 'path'
import { babelConfig } from '../../config'
import { getExternals, hasModuleFile } from '../../utils'
import type { Configuration } from 'webpack'
import type { IntegralTorchConfig } from '../../index'

export type ServerEntry = {
  routes: string,
  view: string,
  mdlw: string
} | {
  routes: string,
  view: string,
}

export default function getConfig(config: IntegralTorchConfig): Configuration {
  let entry: ServerEntry

  if (config.mdlw && hasModuleFile(config.mdlw)) {
    entry = {
      routes: config.src,
      view: path.resolve(__dirname, '../../document'),
      mdlw: config.mdlw
    }
  } else {
    entry = {
      routes: config.src,
      view: path.resolve(__dirname, '../../document'),
    }
  }

  return {
    target: 'node',
    mode: 'development',
    watch: true,
    context: config.src,
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