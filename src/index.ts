/// <reference path="global.d.ts" />
///////////////////////////////////////////////////////////////////////////////
// CONSTANTS
///////////////////////////////////////////////////////////////////////////////
export const TORCH_DIR = '.torch'
export const TORCH_CLIENT_DIR = 'client'
export const TORCH_SERVER_DIR = 'server'
export const TORCH_PUBLIC_DIR = 'public'
export const TORCH_PUBLIC_PATH = '__torch'
export const TORCH_SRC_DIR = 'src'
export const TORCH_MIDDLEWARE_DIR = 'middleware'
export const TORCH_MDLW_FILE_NAME = 'middleware.js'
export const TORCH_DOCUMENT_FILE_NAME = 'document.js'
export const TORCH_ROUTES_FILE_NAME = 'routes.js'
export const TORCH_ASSETS_FILE_NAME = 'assets.json'
export const TORCH_FAVICON_FILE_NAME = 'favicon.ico'
export const TORCH_DOCUMENT_CONTAINER = 'root'

export enum Env {
  Development = 'development',
  Production = 'production',
}

export enum Side {
  Client = 'client',
  Server = 'server',
}

export enum PreloadType {
  Link = 'link',
  Inner = 'inner',
}

export enum HistoryType {
  Browser = 'browser',
  Hash = 'hash',
}

///////////////////////////////////////////////////////////////////////////////
// TYPES
///////////////////////////////////////////////////////////////////////////////
import type { Server } from 'http'
import type { Express, Application } from 'express'
import type { Configuration } from 'webpack'

export type TorchConfig = {
  host?: string
  port?: number
  dir?: string
  src?: string
  public?: string
  cdn?: string
  middleware?: string | false
  document?: string | false
  container?: string | false
  ssr?: boolean
  title?: string
  favicon?: string | boolean
  styleMode?: PreloadType
  createServer?: ServerCreater
  transformWebpackConfig?: WebpackConfigTransform
  installPolyfill?: PolyfillInstaller
}

export type IntegralTorchConfig = {
  host: string
  port: number
  dir: string
  src: string
  public: string
  cdn: string
  middleware: string | false
  document: string
  container: string
  ssr: boolean
  title: string
  favicon: string | false
  styleMode: PreloadType
  createServer: ServerCreater | false
  transformWebpackConfig: WebpackConfigTransform
  installPolyfill: PolyfillInstaller
}

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

export type ServerCreater = (config: IntegralTorchConfig) => Express

export type PolyfillInstaller = (config: IntegralTorchConfig) => void

export type WebpackConfigTransform = (
  config: Configuration,
  packContext: PackContext,
  torchConfig: IntegralTorchConfig
) => Configuration

export type ScriptOptions = {
  dir?: string
  port?: string
  config?: string
}

export type Assets = { index: string; vendor: string } & Record<string, string>

export type RenderContext = {
  url: string
  assets: Assets
  scripts: ScriptPreload[]
  styles: StylePreload[]
  others: Record<string, any>
}
