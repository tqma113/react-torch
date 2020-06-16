export { default as build } from './build/index'
export { default as start } from './start/index'
export { default as dev } from './dev/index'

///////////////////////////////////////////////////////////////////////////////
// TYPES
///////////////////////////////////////////////////////////////////////////////
export * from '../store';
export * from '../page'

import type { Request, Response } from 'express'
import type { Path } from 'path-to-regexp';

export type TorchConfig = {
  port?: string
  dir?: string
  src?: string
  mdlws?: string
  ssr?: boolean
}

export type IntegralTorchConfig = Required<TorchConfig>

export type Env = 'development' | 'production' | 'test'
export type Protocal = 'http' | 'https'
export type Side = 'client' | 'server'

export type Location = {
  pattern: Path,
  protocal: Protocal,
  host: string,
  port: string,
  path: string,
  pathname: string,
  search: string,
  hash: string
}

export type Context = {
  req: Request,
  res: Response,
  ssr: boolean,
  env: Env,
  basename: string,
  side: Side
}