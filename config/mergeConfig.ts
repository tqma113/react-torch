import path from 'path'
import type {
  TorchConfig,
  IntegralTorchConfig, Env
} from 'type'

const DEVELOPMENT_PORT = '3000'
const PRODUCTION_PORT = '80'
const SRC = 'src'
const MDLWS = 'middlewares'

export default function merge(config: TorchConfig, env: Env = 'development'): IntegralTorchConfig {
  const dir = config.dir
    ? path.resolve(process.cwd(), config.dir)
    : process.cwd()
  const port = config.port || (env === 'development' ? DEVELOPMENT_PORT : PRODUCTION_PORT)
  const src = config.src
    ? path.resolve(dir, config.src)
    : path.resolve(dir, SRC)
  const mdlws = config.mdlws
    ? path.resolve(dir, config.mdlws)
    : path.resolve(dir, MDLWS)
  const ssr = config.ssr === undefined ? true : config.ssr

  return {
    dir,
    port,
    src,
    mdlws,
    ssr
  }
}