import path from 'path'
import start from '../src/start'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { Side } from '../src'
import type { Configuration } from 'webpack'

start({
  dir: path.resolve(__dirname),
  webpack: (config, packContext) => {
    if (packContext.packSide === Side.Client) {
      return getClientWebpackConfig(config)
    } else {
      return getServerWebpackConfig(config)
    }
  },
})

const getClientWebpackConfig = (config: Configuration): Configuration => {
  config.module?.rules.push({
    test: /\.css$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          publicPath: '__torch/',
          hmr: true,
        },
      },
      'css-loader',
    ],
  }, {
    test: /\.less$/,
    use: [
      { loader: 'css-loader', options: { importLoaders: 1 } },
      'less-loader'
    ]
  })
  config.plugins?.push(
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css',
    })
  )
  return config
}

const getServerWebpackConfig = (config: Configuration): Configuration => {
  config.module?.rules.push({
    test: /\.css$/,
    use: ['null-loader'],
  }, {
    test: /\.less$/,
    use: ['null-loader'],
  })
  return config
}
