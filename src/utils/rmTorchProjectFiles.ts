import path from 'path'
import rimraf from 'rimraf'

export default function rmTorchProjectFiles(dir: string) {
  const torchProjectDir = path.resolve(dir, '.torch')

  console.info(`Removing ${torchProjectDir}...\n`)

  rimraf.sync(torchProjectDir)

}