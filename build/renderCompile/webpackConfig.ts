import path from 'path'
import { babelConfig } from '../../config'
import { getExternals } from './utils'
import type { Configuration } from 'webpack'
import type { IntegralTorchConfig } from 'type'

export default function getConfig(config: IntegralTorchConfig): Configuration {
  return {
    target: 'node',
    mode: 'production',
    watch: true,
		context: config.src,
    entry: {
      routes: config.src,
      view: path.resolve(__dirname, './view')
    },
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