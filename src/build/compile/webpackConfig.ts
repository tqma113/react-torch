import path from 'path'
import { IgnorePlugin } from 'webpack'
import TerserPlugin from 'terser-webpack-plugin'
import {
  WebpackManifestPlugin,
  Options,
  FileDescriptor,
} from 'webpack-manifest-plugin'

import { babelConfig } from '../../internal/config'
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
        new TerserPlugin({
          terserOptions: {
            ecma: 5,
            compress: {
              ecma: 5, // 默认为5，但目前ts似乎不支持该参数
              drop_console: true,
              // Disabled because of an issue with Uglify breaking seemingly valid code:
              // https://github.com/facebook/create-react-app/issues/2376
              // Pending further investigation:
              // https://github.com/mishoo/UglifyJS2/issues/2011
              comparisons: false,
              // Disabled because of an issue with Terser breaking valid code:
              // https://github.com/facebook/create-react-app/issues/5250
              // Pending futher investigation:
              // https://github.com/terser-js/terser/issues/120
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              // Turned on because emoji and regex is not minified properly using default
              // https://github.com/facebook/create-react-app/issues/2488
              ascii_only: true,
            },
          },
          // Use multi-process parallel running to improve the build speed
          // Default number of concurrent runs: os.cpus().length - 1
          parallel: true,
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
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            ...babelConfig,
            cacheDirectory: true,
            cacheCompression: true,
            compact: true,
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
