import path from 'path'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { Side, PackContext, Env, TorchConfig } from '../src'
import type { Configuration } from 'webpack'

const getClientWebpackConfig = (
  config: Configuration,
  packContext: PackContext
): Configuration => {
  config.module?.rules.push(
    {
      test: /\.css$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: '__torch/',
            hmr: packContext.env === Env.Development,
          },
        },
        'css-loader',
      ],
    },
    {
      test: /\.less$/,
      use: [
        { loader: 'css-loader', options: { importLoaders: 1 } },
        'less-loader',
      ],
    }
  )
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
  config.module?.rules.push(
    {
      test: /\.css$/,
      use: ['null-loader'],
    },
    {
      test: /\.less$/,
      use: ['null-loader'],
    }
  )
  return config
}

const config: TorchConfig = {
  dir: path.resolve(__dirname),
  webpack: (config, packContext) => {
    if (packContext.packSide === Side.Client) {
      return getClientWebpackConfig(config, packContext)
    } else {
      return getServerWebpackConfig(config)
    }
  },
}

export default config
