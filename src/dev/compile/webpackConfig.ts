import fs from 'fs'
import path from 'path'
import { IgnorePlugin, HotModuleReplacementPlugin } from 'webpack'
import {
  WebpackManifestPlugin,
  Options,
  FileDescriptor,
} from 'webpack-manifest-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'

import { babelConfig } from '../../lib/config'
import SetManifestPlugin from './SetManifestPlugin'
import { TORCH_DIR, TORCH_CLIENT_DIR, TORCH_PUBLIC_PATH } from '../../index'

import type { Configuration, WebpackPluginInstance } from 'webpack'
import type { IntegralTorchConfig } from '../../index'

function getConfig(config: IntegralTorchConfig): Configuration {
  // Check if TypeScript is setup
  const appTsConfigPath = path.resolve(config.dir, 'tsconfig.json')
  const useTypeScript = fs.existsSync(appTsConfigPath)

  const manifestPluginOption: Options = {
    fileName: './assets.json',
    map(file: FileDescriptor): FileDescriptor {
      // 删除 .js 后缀，方便直接使用 obj.name 来访问
      if (file.name) {
        if (/\.js$/.test(file.name)) {
          file.name = file.name.slice(0, -3)
        }
      }
      return file
    },
  }

  const plugins: WebpackPluginInstance[] = [
    new WebpackManifestPlugin(manifestPluginOption),
    new SetManifestPlugin(),
    new IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    new HotModuleReplacementPlugin(),
  ]
  // TypeScript type checking

  if (useTypeScript) {
    plugins.push(new ForkTsCheckerWebpackPlugin({
      async: process.env.NODE_ENV === 'development',
      issue: {
        // This one is specifically to match during CI tests,
        // as micromatch doesn't match
        // '../cra-template-typescript/template/src/App.tsx'
        // otherwise.
        include: [
          '**',
        ].map((file) => ({ file })),
        exclude: [
          '**/src/**/__tests__/**',
          '**/src/**/?(*.)(spec|test).*',
          '**/src/setupProxy.*',
          '**/src/setupTests.*',
        ].map((file) => ({ file })),
      },
      logger: {
        infrastructure: 'silent',
      },
    }))
  }

  return {
    mode: 'development',
    bail: false,
    target: 'web',
    context: config.dir,
    entry: {
      index: [
        'webpack-hot-middleware/client',
        path.resolve(__dirname, '../../lib/client/index'),
      ],
    },
    devtool: 'cheap-module-source-map',
    output: {
      path: path.join(
        config.dir,
        TORCH_DIR,
        TORCH_CLIENT_DIR,
        TORCH_PUBLIC_PATH
      ),
      publicPath: `/${TORCH_PUBLIC_PATH}/`,
      filename: `js/[name].js`,
      chunkFilename: `js/[name].js`,
      pathinfo: true,
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        name: 'vendor',
      },
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
    plugins,
  }
}

export default getConfig
