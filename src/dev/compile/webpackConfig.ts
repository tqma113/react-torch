import path from 'path'
import { IgnorePlugin, HotModuleReplacementPlugin } from 'webpack'
import PnpWebpackPlugin from 'pnp-webpack-plugin'
import ManifestPlugin from 'webpack-manifest-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { babelConfig } from '../../config'
import type { Configuration } from 'webpack'
import type { IntegralTorchConfig } from '../../index'

function getConfig(config: IntegralTorchConfig): Configuration {
  const manifestPluginOption: ManifestPlugin.Options = {
    fileName: './assets.json',
    map(
      file: ManifestPlugin.FileDescriptor
    ): ManifestPlugin.FileDescriptor {
      // 删除 .js 后缀，方便直接使用 obj.name 来访问
      if (file.name && /\.js$/.test(file.name)) {
        file.name = file.name.slice(0, -3)
      }
      return file
    }
  }

  return {
    mode: 'development',
    target: 'web',
    context: config.dir,
    entry: {
      index: [
        'webpack-hot-middleware/client',
        path.resolve(__dirname, '../../client/index')
      ]
    },
    devtool: 'cheap-module-eval-source-map',
    output: {
      path: path.join(config.dir, '.torch', 'client'),
      publicPath: '__torch/',
      filename: `js/[name].js`,
      chunkFilename: `js/[name].js`,
      pathinfo: true,
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        name: 'vendor'
      }
    },
    performance: {
      hints: false,
      maxEntrypointSize: 400000
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
            cacheDirectory: true
          }
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: '__torch/',
                hmr: true
              },
            },
            'css-loader',
          ],
        }
      ]
    },
    resolve: {
      alias: {
        '@routes': config.src
      },
      modules: ['node_modules'],
      extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
      plugins: [
        PnpWebpackPlugin
      ]
    },
    resolveLoader: {
      modules: ['node_modules'],
      extensions: ['.js', '.json', '.ts', '.jsx', '.tsx'],
      plugins: [
        PnpWebpackPlugin.moduleLoader
      ]
    },
    plugins: [
      new ManifestPlugin(manifestPluginOption),
      new IgnorePlugin(/^\.\/locale$/, /moment$/ ),
      new HotModuleReplacementPlugin(),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'css/[name].css',
        chunkFilename: 'css/[id].css',
      }),
    ]
  }
}

export default getConfig
