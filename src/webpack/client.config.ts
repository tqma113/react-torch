import path from 'path'
import webpack from 'webpack'
import ManifestPlugin from 'webpack-manifest-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

import getBabelConfig from './babel'
import { Options } from './index'
import { getMode, getWatch } from '../utils'

const getClientConfig = (options: Options) => {
  const defaultOutput: webpack.Output = {
    path: options.public + '/static',
    filename: `js/[name].js`,
    chunkFilename: `js/[name].js`,
    publicPath: '/static/'
  }

  let src = path.resolve(options.root, options.src)
  let output = defaultOutput
  let moduleConfig = {
    strictExportPresence: true,
		rules: [
      { parser: { requireEnsure: false } },
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: '/node_modules/',
        loader: 'babel-loader',
        options: {
          babelrc: false,
          configFile: false,
          cacheDirectory: true,
          cacheCompression: true,
          compact: true,
          ...getBabelConfig(false)
        }
      }
    ]
  }
  let plugins = [
    new ManifestPlugin({
      fileName: options.manifest || 'manifest.json',
      map: (file: ManifestPlugin.FileDescriptor) => {
        // 删除 .js 后缀，方便直接使用 obj.name 来访问
        if (file.name && /\.js$/.test(file.name)) {
          file.name = file.name.slice(0, -3)
        }
        return file
      }
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/ ),
    new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(options.env)
    }),
    new ForkTsCheckerWebpackPlugin({
			async: true,
			useTypescriptIncrementalApi: true,
			checkSyntacticErrors: true,
			tsconfig: path.join(options.root, 'tsconfig.json'),
			reportFiles: [
				'**',
				'!**/*.json',
				'!**/__tests__/**',
				'!**/?(*.)(spec|test).*',
				'!**/src/setupProxy.*',
				'!**/src/setupTests.*',
			],
			watch: options.root
    }),
    // new BundleAnalyzerPlugin()
  ]
  let optimization: webpack.Options.Optimization = {
		// Automatically split vendor and commons
		// https://twitter.com/wSokra/status/969633336732905474
		// https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
		splitChunks: {
			chunks: 'all',
			name: 'vendor'
		}
  }
  let performance: webpack.PerformanceOptions = {
		hints: false,
		maxEntrypointSize: 400000,
  }
  let resolve = {
		modules: [
			path.resolve('node_modules'),
			path.join(options.root, 'node_modules'),
			path.join(__dirname, '../../node_modules')
		],
		extensions: ['.js', '.jsx', '.json', '.mjs', '.ts', '.tsx'],
		// alias: alias,
		// plugins: [
		// 	// Adds support for installing with Plug'n'Play, leading to faster installs and adding
		// 	// guards against forgotten dependencies and such.
		// 	PnpWebpackPlugin
		// ]
  }
  let resolveLoader: webpack.ResolveLoader = {
		plugins: [
			// Also related to Plug'n'Play, but this time it tells Webpack to load its loaders
			// from the current package.
			// PnpWebpackPlugin.moduleLoader(module)
		]
	}

  let result: webpack.Configuration = {
    mode: getMode(options.env),
    target: 'web',
    bail: true,
    watch: getWatch(options.env),
    devtool: 'inline-source-map',
    entry: [path.resolve(__dirname, '../client/index.ts')],
    output,
    module: moduleConfig,
    plugins,
    optimization,
    performance,
    resolve,
    context: options.root,
    resolveLoader
  }

  return result
}

export default getClientConfig