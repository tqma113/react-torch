/// <reference path="../torch.d.ts" />

import compile from './compile'
import renderCompile from './renderCompile'
import copyPublic from './copyPublic'
import { mergeConfig } from '../config'
import { rmTorchProjectFiles } from '../utils'
import type { TorchConfig, TinyContext, PackContext } from '../index'

export default function build(draftConfig: TorchConfig) {
  const config = mergeConfig(draftConfig)
  const tinyContext: TinyContext = {
    ssr: config.ssr,
    env: process.env.NODE_ENV,
  }
  const clientContext: PackContext = {
    ...tinyContext,
    packSide: 'client',
  }
  const serverContext: PackContext = {
    ...tinyContext,
    packSide: 'server',
  }

  // remove before
  rmTorchProjectFiles(config.dir)

  renderCompile(config, serverContext)
    .then(() => compile(config, clientContext))
    .then(() => copyPublic(config.dir))
    .then(() => console.info('Compile finish!'))
    .then(() => process.exit())
    .catch((err) => {
      console.log(err)
      throw err
    })
}
