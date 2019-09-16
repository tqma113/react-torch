import { GenerateConfig, Config } from "../index";
import defaultConfig from './default.config'
import path from 'path'

const generateConfig: GenerateConfig = (options) => {
  let config: Config = defaultConfig

  for (let key in options) {
    config[key] = options[key]
  }

  config.src = path.resolve(config.root, config.src)
  config.public = path.resolve(config.root, config.public)

  return config
}

export default generateConfig