import path from 'path'

import { babelConfig } from '../../internal/config'
import { getExternals } from '../../internal/utils'
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
    mode: 'production',
    context: config.src,
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
      minimize: true,
    },
    performance: {
      hints: 'error',
      maxEntrypointSize: 400000,
    },
    resolve: {
      modules: ['node_modules'],
      extensions: ['.js', '.jsx', '.json', '.mjs', '.ts', '.tsx'],
    },
    externals: getExternals(config.dir),
  }
}
