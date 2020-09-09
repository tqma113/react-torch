export * from './context'
export * from './hook'
export * from './store'
export * from './page'
export * from './router'

///////////////////////////////////////////////////////////////////////////////
// CONSTANTS
///////////////////////////////////////////////////////////////////////////////
export const TORCH_DIR = '.torch'
export const TORCH_CLIENT_DIR = 'client'
export const TORCH_SERVER_DIR = 'server'
export const TORCH_PUBLIC_DIR = 'public'
export const TORCH_MDLW_FILE_NAME = 'middleware.js'
export const TORCH_ROUTES_FILE_NAME = 'routes.js'
export const TORCH_ASSETS_FILE_NAME = 'assets.json'

export enum Env {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export enum Side {
  Client = 'client',
  Server = 'server',
}

export enum PreloadType {
  Link = 'link',
  Inner = 'inner',
}

///////////////////////////////////////////////////////////////////////////////
// TYPES
///////////////////////////////////////////////////////////////////////////////
import type { Server } from 'http'
import type { Request, Response, Application } from 'express'
import type { Configuration } from 'webpack'

export type TorchConfig = {
  host?: string
  port?: number
  dir?: string
  src?: string
  middlewares?: string | false
  ssr?: boolean
  title?: string
  styleMode?: PreloadType
  webpack?: (config: Configuration, packContext: PackContext) => Configuration
}

export type IntegralTorchConfig = Required<TorchConfig>

export type TinyContext = {
  ssr: boolean
  env: Env
}
export type PackContext = TinyContext & {
  packSide: Side
}
export type ClientContext = TinyContext & {
  side: Side.Client
}
export type ServerContext = TinyContext & {
  req: Request
  res: Response
  side: Side.Server
}

export type TorchData = {
  context: Context
  container: string
  state: object
}

export type Context = ClientContext | ServerContext

export type Middleware = (app: Application, server: Server) => void

export type Middlewares = {
  assets?: Middleware
} & Record<string, Middleware>

export type StylePreload =
  | {
      type: PreloadType.Inner
      content: string
    }
  | {
      type: PreloadType.Link
      href: string
      preload: boolean
    }

export type ScriptPreload =
  | {
      type: PreloadType.Inner
      content: string
    }
  | {
      type: PreloadType.Link
      src: string
    }
