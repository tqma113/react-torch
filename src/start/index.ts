import path from 'path'
import { mergeConfig } from '../internal/config'
import createRender from './render'
import { TORCH_DIR, TORCH_CLIENT_DIR } from '../index'
import type { TorchConfig, IntegralTorchConfig, RenderContext } from '../index'

export type TorchRender = (renderContext: RenderContext) => Promise<JSX.Element>

export type Torch = {
  config: IntegralTorchConfig
  static: () => string
  render: TorchRender
}

export default function torch(draftConfig: TorchConfig) {
  return pureTorch(mergeConfig(draftConfig))
}

export const pureTorch = async (
  config: IntegralTorchConfig
): Promise<Torch> => {
  config.installPolyfill(config)

  const staticPath = path.resolve(config.dir, TORCH_DIR, TORCH_CLIENT_DIR)

  const render = createRender(config)

  return {
    config,
    static: () => staticPath,
    render,
  }
}
