/// <reference path="../global.d.ts" />

import fs from 'fs-extra'
import path from 'path'
import compile from './compile'
import renderCompile from './renderCompile'
import copyPublic from './copyPublic'
import { mergeConfig } from '../lib/config'
import { step, info, error } from '../lib/utils'
import { Side, TORCH_DIR } from '../index'
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
  step(`Clearing ${TORCH_DIR}...\n`)
  fs.emptyDirSync(path.resolve(config.dir, TORCH_DIR))

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
