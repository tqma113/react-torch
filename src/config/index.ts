import path from 'path'
import defaultConfig from './default.config'
import { RenderOptions } from '../render'
import { ENV } from '../utils'

export interface Config {
  src: string
  root: string
  container: string
  public: string
  SSR: boolean
  env: ENV
  [key: string]: any
}

export interface GenerateConfig {
  (options?: RenderOptions): Config
}

const generateConfig: GenerateConfig = (options = {}) => {
  let config: Config = defaultConfig

  config = Object.assign(config, options)

  config.src = path.resolve(config.root, config.src)
  config.public = path.resolve(config.root, config.public)

  return config
}

export default generateConfig