import path from 'path'
import React from 'react'
import defaultConfig from './default.config'
import { RenderOptions } from '../render'

export type ENV = 'test' | 'development' | 'production'

export interface Config {
  App: () => Promise<React.ComponentType>
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

  config.src = path.join(config.root, config.src)
  config.App = () => import(config.src)
  config.public = path.resolve(config.root, config.public)

  console.log(config)

  return config
}

export default generateConfig