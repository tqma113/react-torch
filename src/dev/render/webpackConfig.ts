import path from 'path'
import PnpWebpackPlugin from 'pnp-webpack-plugin'

import { babelConfig } from '../../lib/config'
import { getExternals } from '../../lib/utils'

import { TORCH_DIR, TORCH_SERVER_DIR } from '../../index'

import type { Configuration } from 'webpack'
import type { IntegralTorchConfig } from '../../index'

export default function getConfig(config: IntegralTorchConfig): Configuration {
  let entry: Record<string, string> = {
    routes: config.src,
    document: config.document,
  }

  if (config.middleware) {
    entry.middleware = config.middleware
  }

  return {
    target: 'node',
    mode: 'development',
    watch: true,
    context: config.dir,
    entry,
    output: {
      path: path.join(config.dir, TORCH_DIR, TORCH_SERVER_DIR),
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
