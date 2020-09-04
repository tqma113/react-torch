export const TORCH_DIR = '.torch'
export const TORCH_CLIENT_DIR = 'client'
export const TORCH_SERVER_DIR = 'server'
export const TORCH_PUBLIC_DIR = 'public'
export const TORCH_MDLW_FILE_NAME = 'mdlw.js'
export const TORCH_ROUTES_FILE_NAME = 'routes.js'
export const TORCH_ASSETS_FILE_NAME = 'assets.json'

///////////////////////////////////////////////////////////////////////////////
// TYPES
///////////////////////////////////////////////////////////////////////////////
export * from '../store'
export * from '../page'

import type { Server } from 'http'
import type { Request, Response, Application } from 'express'
import type { Configuration } from 'webpack'

export type TorchConfig = {
  port?: string
  dir?: string
  src?: string
  mdlw?: string | false
  ssr?: boolean
  title?: string
  styleMode?: PreloadType
  webpack?: (config: Configuration, packContext: PackContext) => Configuration
}

export type IntegralTorchConfig = Required<TorchConfig>

export type Env = 'development' | 'production' | 'test'
export type Side = 'client' | 'server'

export type TinyContext = {
  ssr: boolean
  env: Env
}
export type PackContext = TinyContext & {
  packSide: Side
}
export type ClientContext = TinyContext & {
  side: 'client'
}
export type ServerContext = TinyContext & {
  req: Request
  res: Response
  side: 'server'
}

export type TORCH_DATA = {
  context: Context
  container: string
  state: object
}

export type Context = ClientContext | ServerContext

export type Mdlw = (app: Application, server: Server) => void

export type PreloadType = 'inner' | 'link'

export type StylePreload =
  | {
      type: 'inner'
      content: string
    }
  | {
      type: 'link'
      href: string
      preload: boolean
    }

export type ScriptPreload =
  | {
      type: 'inner'
      content: string
    }
  | {
      type: 'link'
      src: string
    }
