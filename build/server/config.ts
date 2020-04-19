import path from 'path'
import { Configuration } from 'webpack'
import babelConfig from '../babel'
import { getExternals } from './utils'

export default function getConfig(dir: string): Configuration {
  const src = path.resolve(dir, 'src')
  return {
    target: 'node',
    mode: 'production',
    watch: true,
		context: src,
    entry: {
      routes: src,
      view: path.resolve(__dirname, './view')
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
    externals: getExternals(dir)
  }
}