import path from 'path'

import { getExternals } from '../../../internal/utils'

import { TORCH_DIR, TORCH_SERVER_DIR } from '../../../index'

import type { Configuration } from 'webpack'
import type { IntegralTorchConfig } from '../../../index'

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
          test: /\.(js|jsx)$/,
          loader: 'esbuild-loader',
          options: {
            loader: 'jsx',
            target: 'es2015',
            jsxFactory: 'React.createElement',
            jsxFragment: 'React.Fragment',
          },
        },
        {
          test: /\.(ts|tsx)$/,
          loader: 'esbuild-loader',
          options: {
            loader: 'tsx',
            target: 'es2015',
            jsxFactory: 'React.createElement',
            jsxFragment: 'React.Fragment',
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
    },
    externals: getExternals(config.dir).concat('react-torch/client'),
  }
}
