import path from 'path'
import { NodeVM, CompilerFunction } from 'vm2'
import { transformSync } from 'esbuild'

import type { TorchConfig } from '../../index'

const compiler: CompilerFunction = (code, filename) => {
  const version = process.versions.node.split('.')[0]
  const result = transformSync(code, {
    loader: 'ts',
    target: `node${version}`,
    format: 'cjs',
    sourcefile: filename,
  })
  if (result && result.code) {
    return result.code
  } else {
    throw new Error(`The file: ${filename} has syntax error`)
  }
}

function requireFile(filePath: string): any {
  const dir = path.dirname(filePath)
  const vm = new NodeVM({
    compiler,
    sourceExtensions: ['js', 'ts', 'jsx', 'tsx', 'json', 'mjs'],
    require: {
      root: dir,
      external: true,
      builtin: ['*'],
    },
  })
  return vm.runFile(filePath)
}

export default function requireConfig(filePath: string): TorchConfig {
  const result = requireFile(filePath)
  return result.default || result
}
