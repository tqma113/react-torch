import path from 'path'
import fs from 'fs-extra'
import { step } from './index'
import { TORCH_DIR } from '../../index'

export default function rmTorchProjectFiles(dir: string) {
  const torchProjectDir = path.resolve(dir, TORCH_DIR)

  step(`\nClearing ${torchProjectDir}...\n`)

  fs.emptyDirSync(torchProjectDir)
}
