import path from 'path'
import rimraf from 'rimraf'
import { TORCH_DIR } from '../index'

export default function rmTorchProjectFiles(dir: string) {
  const torchProjectDir = path.resolve(dir, TORCH_DIR)

  console.info(`Removing ${torchProjectDir}...\n`)

  rimraf.sync(torchProjectDir)
}
