export { default as build } from './build/index'
export { default as start } from './start/index'
export { default as dev } from './dev/index'

///////////////////////////////////////////////////////////////////////////////
// TYPES
///////////////////////////////////////////////////////////////////////////////
export * from '../store';
export * from '../page'

import type { Request, Response } from 'express'

export type TorchConfig = {
  port?: string
  dir?: string
  src?: string
  mdlws?: string
  ssr?: boolean
}

export type IntegralTorchConfig = Required<TorchConfig>

export type Env = 'development' | 'production' | 'test'
export type Side = 'client' | 'server'

export type ClientContext = {
  ssr: boolean,
  env: Env,
  side: 'client'
}
export type ServerContext = {
  req: Request,
  res: Response,
  ssr: boolean,
  env: Env,
  side: 'server'
}

export type Context = ClientContext | ServerContext