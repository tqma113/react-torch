import path from 'path'
import { hasModuleFile } from './'
import { TORCH_DIR, TORCH_SERVER_DIR, TORCH_MDLW_FILE_NAME } from '../../index'
import type { IntegralTorchConfig, Middlewares } from '../../index'

export const requireMiddleware = (config: IntegralTorchConfig) => {
  const middlewarePath = path.resolve(
    config.dir,
    TORCH_DIR,
    TORCH_SERVER_DIR,
    TORCH_MDLW_FILE_NAME
  )

  if (hasModuleFile(middlewarePath)) {
    return require(middlewarePath) as Middlewares
  } else {
    return undefined
  }
}
