import { ENV } from './util'

export interface Options {
  env: ENV
  src: string
  root: string
  publish: string
  static: string

  manifest?: string
}

export { default as generateServerConfig } from './server.config'

export { default as generateClientConfig } from './client.config'