import path from 'path'
import { Configuration } from 'webpack'
import babelConfig from '../babel'
import { getExternals } from './utils'

export default function getConfig(dir: string): Configuration {
  const src = path.resolve(dir, 'src')
  console.log(src)
  return {
    target: 'node',
    mode: 'development',
    watch: true,
		context: src,
    entry: {
      routes: src
    },
    output: {
			path: path.join(dir, '.torch', 'server'),
			filename: 'routes.js',
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
          options: babelConfig
        }
      ]
    },
    optimization: {
      // splitChunks: {
      //   chunks: 'all',
      //   name: 'vendor'
      // }
    },
    performance: {
      hints: false,
      maxEntrypointSize: 400000,
    },
    resolve: {
      modules: ['node_modules'],
      extensions: ['.js', '.jsx', '.json', '.mjs', '.ts', '.tsx'],
      alias: {
        '$routes': path.resolve(src, 'index.ts')
      }
    },
    externals: getExternals(dir)
  }
}