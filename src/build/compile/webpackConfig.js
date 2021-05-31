'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
var tslib_1 = require('tslib')
var path_1 = tslib_1.__importDefault(require('path'))
var webpack_1 = require('webpack')
var webpack_manifest_plugin_1 = require('webpack-manifest-plugin')
var esbuild_loader_1 = require('esbuild-loader')
var index_1 = require('../../index')
function getConfig(config) {
  var manifestPluginOption = {
    fileName: './assets.json',
    map: function (file) {
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
      index: [path_1.default.resolve(__dirname, '../../internal/client/index')],
    },
    devtool: 'source-map',
    output: {
      path: path_1.default.join(
        config.dir,
        index_1.TORCH_DIR,
        index_1.TORCH_CLIENT_DIR,
        index_1.TORCH_PUBLIC_PATH
      ),
      publicPath: '/' + index_1.TORCH_PUBLIC_PATH + '/',
      filename: 'js/[name]-[contenthash:6].js',
      chunkFilename: 'js/[name]-[contenthash:6].js',
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        name: 'vendor',
      },
      minimize: true,
      minimizer: [
        new esbuild_loader_1.ESBuildMinifyPlugin({
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
      new webpack_manifest_plugin_1.WebpackManifestPlugin(manifestPluginOption),
      new webpack_1.IgnorePlugin({
        contextRegExp: /^\.\/locale$/,
        resourceRegExp: /moment$/,
      }),
    ],
  }
}
exports.default = getConfig
//# sourceMappingURL=webpackConfig.js.map
