import path from 'path'
import { PreloadType } from '../index'
import type { TorchConfig, IntegralTorchConfig } from '../index'

const TITLE = 'React Torch'
const DEVELOPMENT_PORT = '3000'
const PRODUCTION_PORT = '80'
const SRC = 'src'
const MDLW = 'mdlw'
const noop = (a: any) => a

export default function merge(config: TorchConfig): IntegralTorchConfig {
  const title = config.title || TITLE
  const dir = config.dir
    ? path.resolve(process.cwd(), config.dir)
    : process.cwd()
  const port =
    config.port ||
    (process.env.NODE_ENV === 'development'
      ? DEVELOPMENT_PORT
      : PRODUCTION_PORT)
  const src = config.src
    ? path.resolve(dir, config.src)
    : path.resolve(dir, SRC)
  const mdlw =
    config.mdlw === false
      ? config.mdlw
      : config.mdlw
      ? path.resolve(dir, config.mdlw)
      : path.resolve(dir, MDLW)
  const ssr = config.ssr === undefined ? true : config.ssr
  const styleMode = config.styleMode || PreloadType.Inner
  const webpack = config.webpack || noop

  return {
    title,
    dir,
    port,
    src,
    mdlw,
    ssr,
    styleMode,
    webpack,
  }
}
