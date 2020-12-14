import path from 'path'
import serveStatic from 'serve-static'
import { mergeConfig } from '../internal/config'
import createDevRender from './dev/render'
import compile from './dev/compile'
import createRender from './render'
import { prepareUrls, Urls } from '../internal/utils'
import {
  Env,
  TORCH_DIR,
  TORCH_CLIENT_DIR,
  TORCH_PUBLIC_DIR,
  TORCH_PUBLIC_PATH,
  TORCH_ASSETS_FILE_NAME,
} from '../index'
import type { TorchConfig, IntegralTorchConfig } from '../index'
import type { Compiler } from 'webpack'
import type { RequestHandler } from 'express'
import type { WebpackDevMiddleware } from 'webpack-dev-middleware'
import type { NextHandleFunction } from 'connect'

export default function (draftConfig: TorchConfig) {
  return createApp(mergeConfig(draftConfig))
}

export const createApp = async (config: IntegralTorchConfig) => {
  config.installPolyfill(config)

  const isDev = process.env.NODE_ENV === Env.Development

  const staticPath = path.resolve(config.dir, TORCH_DIR, TORCH_CLIENT_DIR)
  const publicPath = isDev
    ? path.resolve(config.dir, TORCH_PUBLIC_DIR)
    : undefined

  const render = isDev ? await createDevRender(config) : createRender(config)

  let compiler: Compiler | undefined = undefined
  let devMiddleware:
    | (WebpackDevMiddleware & NextHandleFunction)
    | undefined = undefined
  let hotMiddleware: RequestHandler | undefined = undefined
  let urls: Urls | undefined = undefined
  if (isDev) {
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
    urls = prepareUrls(protocol, config.host, config.port)
    ;[compiler, devMiddleware] = await compile(config, urls)
    hotMiddleware = require(`webpack-hot-middleware`)(compiler, {
      log: false,
      quiet: true,
      noInfo: true,
    })
  }

  const devAssetsMiddleware: RequestHandler = (req, res, next) => {
    res.locals.assets = res.locals.webpackStats.assets
    next()
  }

  const prodAssetsMiddleware: RequestHandler = (req, res, next) => {
    const assertPath = path.resolve(
      config.dir,
      TORCH_DIR,
      TORCH_CLIENT_DIR,
      TORCH_PUBLIC_PATH,
      TORCH_ASSETS_FILE_NAME
    )
    res.locals.assets = getAssets(require(assertPath))
    next()
  }

  const assetsMiddleware: RequestHandler = isDev
    ? devAssetsMiddleware
    : prodAssetsMiddleware

  return {
    static: () => serveStatic(staticPath),
    public: publicPath ? () => serveStatic(publicPath) : undefined,
    render,
    compiler,
    devMiddleware,
    hotMiddleware,
    assetsMiddleware,
    urls,
  }
}

function getAssets(stats: Record<string, string | string[]>) {
  return Object.keys(stats).reduce(
    (result: Record<string, string>, assetName) => {
      const value = stats[assetName]
      result[assetName] = Array.isArray(value) ? value[0] : value
      return result
    },
    {}
  )
}
