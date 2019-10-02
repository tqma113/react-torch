import { ENV } from '../utils'

export interface Options {
  env: ENV
  src: string
  root: string
  public: string

  manifest?: string
}

export { default as generateServerConfig } from './server.config'

export { default as generateClientConfig } from './client.config'