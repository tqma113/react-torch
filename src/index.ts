export { default as build } from './build/index'
export { default as start } from './start/index'
export { default as dev } from './dev/index'

///////////////////////////////////////////////////////////////////////////////
// TYPES
///////////////////////////////////////////////////////////////////////////////
export * from '../store';
export * from '../page'

import type { Server } from 'http'
import type { Request, Response, Application } from 'express'
import type {
  DocumentProps
} from './document'

export type RenderData = Omit<DocumentProps, 'assets'>

export type TorchConfig = {
  port?: string
  dir?: string
  src?: string
  mdlw?: string | false
  ssr?: boolean
  title?: string
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

export type TORCH_DATA = {
  context: Context,
  container: string,
  state: object
}

export type Context = ClientContext | ServerContext

export type Mdlw = (app: Application, server: Server) => void

export type PreloadType = 'inner' | 'link'

export type StylePreload = {
  type: 'inner',
  content: string
} | {
  type: 'link',
  href: string
}

export type ScriptPreload = {
  type: 'inner',
  content: string,
} | {
  type: 'link',
  src: string
}