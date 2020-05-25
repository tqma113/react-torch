export { default as build } from './build/index'
export { default as start } from './start/index'
export { default as dev } from './dev/index'

///////////////////////////////////////////////////////////////////////////////
// TYPES
///////////////////////////////////////////////////////////////////////////////
export * from './store';
export * from './page'

export type TorchConfig = {
  port?: string
  dir?: string
  src?: string
  mdlws?: string
  ssr?: boolean
}

export type IntegralTorchConfig = Required<TorchConfig>

export type Env = 'development' | 'production'