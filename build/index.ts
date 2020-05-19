import compile from './compile'
import renderCompile from './renderCompile'
import { mergeConfig } from '../config'
import type { TorchConfig } from 'type'

export default function build(draftConfig: TorchConfig) {
  const config = mergeConfig(draftConfig)
  renderCompile(config)
    .then(() => compile(config))
    .then(() => console.log('Compile finished!'))
    .then(() => process.exit())
    .catch(err => {
      throw err
    })
}