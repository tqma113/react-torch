import path from 'path'
import babelConfig from '../babel'
import { getExternals } from './utils'
import type { Configuration } from 'webpack'

export default function getConfig(dir: string): Configuration {
  const src = path.resolve(dir, 'src')
  return {
    target: 'node',
    mode: 'development',
    watch: true,
		context: src,
    entry: {
      routes: src,
      view: path.resolve(__dirname, '../view')
    },
    output: {
			path: path.join(dir, '.torch', 'server'),
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
    externals: getExternals(dir)
  }
}