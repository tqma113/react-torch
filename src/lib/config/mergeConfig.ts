import path from 'path'
import {
  PreloadType,
  TORCH_SRC_DIR,
  TORCH_PUBLIC_DIR,
  TORCH_MIDDLEWARE_DIR,
  TORCH_FAVICON_FILE_NAME,
} from '../../index'
import type { TorchConfig, IntegralTorchConfig } from '../../index'

const TITLE = 'React Torch'
// Tools like Cloud9 rely on this.
const HOST = process.env.HOST || '0.0.0.0'
const DEFAULT_DOCUMENT_PATH = path.resolve(__dirname, '../document')
const DEVELOPMENT_PORT = 3000
const PRODUCTION_PORT = 80
const identity = <T>(a: T) => a

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

  const srcDir = config.src
    ? path.resolve(dir, config.src)
    : path.resolve(dir, TORCH_SRC_DIR)

  const publicDir = config.public
    ? path.resolve(dir, config.public)
    : path.resolve(dir, TORCH_PUBLIC_DIR)

  const middleware =
    config.middleware === false
      ? config.middleware
      : config.middleware
      ? path.resolve(dir, config.middleware)
      : path.resolve(dir, TORCH_MIDDLEWARE_DIR)

  const document = config.document
    ? path.resolve(dir, config.document)
    : DEFAULT_DOCUMENT_PATH

  const favicon = config.favicon
    ? config.favicon === true
      ? path.resolve(publicDir, TORCH_FAVICON_FILE_NAME)
      : path.resolve(publicDir, config.favicon)
    : false

  const ssr = config.ssr === undefined ? true : config.ssr

  const styleMode = config.styleMode || PreloadType.Inner

  const webpack = config.webpack ? config.webpack : identity

  return {
    title,
    dir,
    host,
    port,
    src: srcDir,
    public: publicDir,
    middleware,
    document,
    favicon,
    ssr,
    styleMode,
    webpack,
  }
}
