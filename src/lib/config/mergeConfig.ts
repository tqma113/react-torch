import path from 'path'
import { PreloadType } from '../../index'
import type { TorchConfig, IntegralTorchConfig } from '../../index'

const TITLE = 'React Torch'
// Tools like Cloud9 rely on this.
const HOST = process.env.HOST || '0.0.0.0'
const DEVELOPMENT_PORT = 3000
const PRODUCTION_PORT = 80
const SRC = 'src'
const MDLW = 'middleware'
const noop = (a: any) => a

export default function merge(config: TorchConfig): IntegralTorchConfig {
  const title = config.title || TITLE
  const dir = config.dir
    ? path.resolve(process.cwd(), config.dir)
    : process.cwd()
  const host = config.host || HOST
  const port =
    config.port ||
    (process.env.NODE_ENV === 'development'
      ? DEVELOPMENT_PORT
      : PRODUCTION_PORT)
  const src = config.src
    ? path.resolve(dir, config.src)
    : path.resolve(dir, SRC)
  const middleware =
    config.middlewares === false
      ? config.middlewares
      : config.middlewares
      ? path.resolve(dir, config.middlewares)
      : path.resolve(dir, MDLW)
  const ssr = config.ssr === undefined ? true : config.ssr
  const styleMode = config.styleMode || PreloadType.Inner
  const webpack = config.webpack
    ? config.webpack
    : noop

  return {
    title,
    dir,
    host,
    port,
    src,
    middlewares: middleware,
    ssr,
    styleMode,
    webpack,
  }
}
