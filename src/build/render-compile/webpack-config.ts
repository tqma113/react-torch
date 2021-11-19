import path from 'path'
import { ESBuildMinifyPlugin } from 'esbuild-loader'

import { getExternals } from '../../internal/utils'
import { OUTPUT_DIR, TORCH_SERVER_DIR } from '../../index'

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
      path: path.join(config.dir, OUTPUT_DIR, TORCH_SERVER_DIR),
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
      minimize: true,
      minimizer: [
        new ESBuildMinifyPlugin({
          target: 'es2015',
        }),
      ],
    },
    performance: {
      hints: 'error',
      maxEntrypointSize: 400000,
    },
    resolve: {
      modules: ['node_modules'],
      extensions: ['.js', '.jsx', '.json', '.mjs', '.ts', '.tsx'],
    },
    externals: getExternals(config.dir).concat('react-torch/client'),
  }
}
