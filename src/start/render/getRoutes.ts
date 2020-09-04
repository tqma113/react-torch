import path from 'path'
import {
  TORCH_DIR,
  TORCH_SERVER_DIR,
  TORCH_ROUTES_FILE_NAME,
} from '../../index'
import type { IntegralTorchConfig } from '../../index'

export default function getRoutes(config: IntegralTorchConfig) {
  const outputPath = path.join(
    config.dir,
    TORCH_DIR,
    TORCH_SERVER_DIR,
    TORCH_ROUTES_FILE_NAME
  )
  const module = require(outputPath)
  return module.default || module
}
