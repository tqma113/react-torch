import { ENV } from '../utils'

export interface Options {
  env: ENV
  src: string
  root: string
  public: string

  manifest?: string
}

export { default as compile } from './compile'