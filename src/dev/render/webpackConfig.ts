import path from 'path'
import { babelConfig } from '../../config'
import { getExternals } from '../../utils'
import PnpWebpackPlugin from 'pnp-webpack-plugin'
import type { Configuration } from 'webpack'
import type { IntegralTorchConfig } from '../../index'

export type ServerEntry =
  | {
      routes: string
      mdlw: string
    }
  | {
      routes: string
    }

export default function getConfig(config: IntegralTorchConfig): Configuration {
  let entry: ServerEntry

  if (config.mdlw) {
    entry = {
      routes: config.src,
      mdlw: config.mdlw,
    }
  } else {
    entry = {
      routes: config.src,
    }
  }

  return {
    target: 'node',
    mode: 'development',
    watch: true,
    context: config.dir,
    entry,
    output: {
      path: path.join(config.dir, '.torch', 'server'),
      filename: '[name].js',
      libraryTarget: 'commonjs2',
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
            cacheDirectory: true,
          },
        },
        {
          test: /\.css$/,
          use: ['null-loader'],
        },
      ],
    },
    optimization: {
      minimize: false,
    },
    performance: {
      hints: 'warning',
      maxEntrypointSize: 400000,
    },
    resolve: {
      modules: ['node_modules'],
      extensions: ['.js', '.jsx', '.json', '.mjs', '.ts', '.tsx'],
      plugins: [PnpWebpackPlugin],
    },
    resolveLoader: {
      plugins: [PnpWebpackPlugin.moduleLoader(module)],
    },
    externals: getExternals(config.dir),
  }
}
