import path from 'path'
import serveStatic from 'serve-static'
import { mergeConfig } from '../internal/config'
import createDevRender from './dev/render'
import compile from './dev/compile'
import createRender from './render'
import { prepareUrls, Urls } from '../internal/utils'
import { Env, TORCH_DIR, TORCH_CLIENT_DIR, TORCH_PUBLIC_DIR } from '../index'
import type { TorchConfig, IntegralTorchConfig } from '../index'
import type { Compiler } from 'webpack'

export default function torch(draftConfig: TorchConfig) {
  return pureTorch(mergeConfig(draftConfig))
}

export const pureTorch = async (config: IntegralTorchConfig) => {
  config.installPolyfill(config)

  const isDev = process.env.NODE_ENV === Env.Development

  const staticPath = path.resolve(config.dir, TORCH_DIR, TORCH_CLIENT_DIR)
  const publicPath = isDev
    ? path.resolve(config.dir, TORCH_PUBLIC_DIR)
    : undefined

  const render = isDev ? await createDevRender(config) : createRender(config)

  let compiler: Compiler | undefined = undefined
  let urls: Urls | undefined = undefined
  if (isDev) {
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
    urls = prepareUrls(protocol, config.host, config.port)
    compiler = await compile(config, urls)
  }

  return {
    config,
    static: () => serveStatic(staticPath),
    public: publicPath ? () => serveStatic(publicPath) : undefined,
    render,
    compiler,
    urls,
  }
}
