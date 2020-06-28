/// <reference path="../torch.d.ts" />

import compile from './compile'
import renderCompile from './renderCompile'
import { mergeConfig } from '../config'
import { rmTorchProjectFiles } from '../utils'
import type { TorchConfig } from '../index'

export default function build(draftConfig: TorchConfig) {
  const config = mergeConfig(draftConfig)

  // remove before
  rmTorchProjectFiles(config.dir)

  renderCompile(config)
    .then(() => compile(config))
    .then(() => console.info('Compile finish!'))
    .then(() => process.exit())
    .catch(err => {
      throw err
    })
}