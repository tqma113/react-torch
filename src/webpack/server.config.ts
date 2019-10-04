import path from 'path'
import webpack from 'webpack'

import getBabelConfig from './babel'
import { Options } from './index'
import { getMode, getWatch } from '../utils'

const getServerConfig = (options: Options) => {
  const defaultOutput: webpack.Output = {
    libraryTarget: 'commonjs2',
    path: options.public,
    filename: 'server.bundle.js',
    publicPath: options.public
  }

  let src = options.src
  let output = defaultOutput
  let moduleConfig = {
    strictExportPresence: true,
		rules: [
      // Disable require.ensure as it's not a standard language feature.
      { parser: { requireEnsure: false } },
      // Process application JS with Babel.
      // The preset includes JSX, Flow, TypeScript and some ESnext features.
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: '/node_modules/',
        loader: 'babel-loader',
        options: {
          // include presets|plugins
          babelrc: false,
          configFile: false,
          cacheDirectory: true,
          cacheCompression: false,
          compact: false,
          ...getBabelConfig(true)
        }
      }
    ]
  }
  let plugins = [
    new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(options.env)
    }),
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
    devtool: 'source-map',
    entry: [src],
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

export default getServerConfig