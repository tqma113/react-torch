import path from 'path'
import { IgnorePlugin } from 'webpack'
import {
  WebpackManifestPlugin,
  Options,
  FileDescriptor,
} from 'webpack-manifest-plugin'
import { ESBuildMinifyPlugin } from 'esbuild-loader'

import { TORCH_DIR, TORCH_CLIENT_DIR, TORCH_PUBLIC_PATH } from '../../index'

import type { Configuration } from 'webpack'
import type { IntegralTorchConfig } from '../../index'

export default function getConfig(config: IntegralTorchConfig): Configuration {
  const manifestPluginOption: Options = {
    fileName: './assets.json',
    map(file: FileDescriptor): FileDescriptor {
      // 删除 .js 后缀，方便直接使用 obj.name 来访问
      if (file.name && /\.js$/.test(file.name)) {
        file.name = file.name.slice(0, -3)
      }
      return file
    },
  }

  return {
    mode: 'production',
    target: 'web',
    context: config.src,
    entry: {
      index: [path.resolve(__dirname, '../../internal/client/index')],
    },
    devtool: 'source-map',
    output: {
      path: path.join(
        config.dir,
        TORCH_DIR,
        TORCH_CLIENT_DIR,
        TORCH_PUBLIC_PATH
      ),
      publicPath: `/${TORCH_PUBLIC_PATH}/`,
      filename: `js/[name]-[contenthash:6].js`,
      chunkFilename: `js/[name]-[contenthash:6].js`,
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        name: 'vendor',
      },
      minimize: true,
      minimizer: [
        new ESBuildMinifyPlugin({
          target: 'es2015',
        }),
      ],
    },
    performance: {
      hints: false,
      maxEntrypointSize: 400000,
    },
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
    resolve: {
      alias: {
        '@routes': config.src,
      },
      modules: ['node_modules'],
      extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    },
    resolveLoader: {
      modules: ['node_modules'],
      extensions: ['.js', '.json', '.ts', '.jsx', '.tsx'],
    },
    plugins: [
      new WebpackManifestPlugin(manifestPluginOption),
      new IgnorePlugin({
        contextRegExp: /^\.\/locale$/,
        resourceRegExp: /moment$/,
      }),
    ],
  }
}
