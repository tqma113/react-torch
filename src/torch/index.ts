import path from 'path'
import { mergeConfig } from '../internal/config'
import createDevRender from './dev/render'
import compile from './dev/compile'
import createRender from './render'
import { prepareUrls, Urls } from '../internal/utils'
import { Env, TORCH_DIR, TORCH_CLIENT_DIR, TORCH_PUBLIC_DIR } from '../index'
import type { TorchConfig, IntegralTorchConfig, ScriptPreload, StylePreload } from '../index'
import type { Compiler } from 'webpack'

export type TorchRender = (
  url: string,
  assets: { index: string; vendor: string },
  scripts: ScriptPreload[],
  styles: StylePreload[],
  others: Record<string, any>
) => Promise<JSX.Element>

export type Torch = {
  config: IntegralTorchConfig
  static: () => string
  public?: () => string
  render: TorchRender
  compiler?: Compiler
  urls?: Urls
}

export default function torch(draftConfig: TorchConfig) {
  return pureTorch(mergeConfig(draftConfig))
}

export const pureTorch = async (config: IntegralTorchConfig): Promise<Torch> => {
  config.installPolyfill(config)

  const isDev = process.env.NODE_ENV === Env.Development

  const staticPath = path.resolve(config.dir, TORCH_DIR, TORCH_CLIENT_DIR)
  const publicPath = isDev
    ? path.resolve(config.dir, TORCH_PUBLIC_DIR)
    : undefined

  const render = isDev ? (await createDevRender(config)) : createRender(config)

  let compiler: Compiler | undefined = undefined
  let urls: Urls | undefined = undefined
  if (isDev) {
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
    urls = prepareUrls(protocol, config.host, config.port)
    compiler = await compile(config, urls)
  }

  return {
    config,
    static: () => staticPath,
    public: publicPath ? () => publicPath : undefined,
    render,
    compiler,
    urls,
  }
}
