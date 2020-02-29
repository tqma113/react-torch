import path from 'path'
import { Configuration, IgnorePlugin, HotModuleReplacementPlugin } from 'webpack'
import ManifestPlugin from 'webpack-manifest-plugin'
import babelConfig from '../babel'

function getConfig(dir: string): Configuration {
  const src = path.resolve(dir, 'src')
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
    context: src,
    entry: {
      index: [
        path.resolve(__dirname, './client/index'),
      ]
    },
    devtool: 'cheap-module-eval-source-map',
    output: {
      path: path.join(dir, '.torch', 'client'),
      filename: `js/[name].js`,
      chunkFilename: `js/[name].js`,
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
          options: babelConfig
        }
      ]
    },
    resolve: {
      alias: {
        '$routes': path.resolve(dir, '.torch', 'server', 'routes')
      },
      modules: ['node_modules'],
      extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    },
    resolveLoader: {
      modules: ['node_modules'],
      extensions: ['.js', '.json', '.ts', '.jsx', '.tsx'],
    },
    plugins: [
      new ManifestPlugin(manifestPluginOption),
      new IgnorePlugin(/^\.\/locale$/, /moment$/ ),
      new HotModuleReplacementPlugin(),

    ]
  }
}

export default getConfig
