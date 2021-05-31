import path from 'path'
import { mergeConfig } from '../internal/config'
import createRender from './render'
import compile from './compile'
import { prepareUrls, Urls } from '../internal/utils'
import { TORCH_DIR, TORCH_CLIENT_DIR, TORCH_PUBLIC_DIR } from '../index'
import type { TorchConfig, IntegralTorchConfig, RenderContext } from '../index'
import type { Compiler } from 'webpack'

export type TorchRender = (renderContext: RenderContext) => Promise<JSX.Element>

export type Torch = {
  config: IntegralTorchConfig
  static: () => string
  public: () => string
  render: TorchRender
  compiler: Compiler
  urls: Urls
}

export default function devTorch(draftConfig: TorchConfig) {
  return pureDevTorch(mergeConfig(draftConfig))
}

export const pureDevTorch = async (
  config: IntegralTorchConfig
): Promise<Torch> => {
  config.installPolyfill(config)

  const staticPath = path.resolve(config.dir, TORCH_DIR, TORCH_CLIENT_DIR)
  const publicPath = path.resolve(config.dir, TORCH_PUBLIC_DIR)

  const render = await createRender(config)

  const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
  const urls = prepareUrls(protocol, config.host, config.port)
  const compiler = await compile(config, urls)

  return {
    config,
    static: () => staticPath,
    public: () => publicPath,
    render,
    compiler,
    urls,
  }
}
