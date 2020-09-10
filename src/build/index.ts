/// <reference path="../global.d.ts" />

import compile from './compile'
import renderCompile from './renderCompile'
import copyPublic from './copyPublic'
import { mergeConfig } from '../config'
import { rmTorchProjectFiles, info, error } from '../utils'
import { Side } from '../index'
import type { TorchConfig, TinyContext, PackContext } from '../index'

export default function build(draftConfig: TorchConfig) {
  const config = mergeConfig(draftConfig)
  const tinyContext: TinyContext = {
    ssr: config.ssr,
    env: process.env.NODE_ENV,
  }
  const clientContext: PackContext = {
    ...tinyContext,
    packSide: Side.Client,
  }
  const serverContext: PackContext = {
    ...tinyContext,
    packSide: Side.Server,
  }

  // remove before
  rmTorchProjectFiles(config.dir)

  renderCompile(config, serverContext)
    .then(() => compile(config, clientContext))
    .then(() => copyPublic(config.dir))
    .then(() => info('Compile finish!'))
    .then(() => process.exit())
    .catch((err) => {
      error(err)
      throw err
    })
}
