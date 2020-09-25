import path from 'path'
import { hasModuleFile } from './'
import {
  TORCH_DIR,
  TORCH_SERVER_DIR,
  TORCH_DOCUMENT_FILE_NAME,
} from '../../index'
import type { IntegralTorchConfig } from '../../index'

export const requireDocument = (config: IntegralTorchConfig) => {
  const documentPath = path.resolve(
    config.dir,
    TORCH_DIR,
    TORCH_SERVER_DIR,
    TORCH_DOCUMENT_FILE_NAME
  )

  if (hasModuleFile(documentPath)) {
    return require(documentPath).default
  } else {
    return undefined
  }
}
