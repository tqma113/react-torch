import fs from 'fs'
import vm from 'vm'
import path from 'path'
import { transformFileSync } from '@babel/core'
import babelConfig from './babelConfig'
import type { IntegralTorchConfig } from '../../index'

enum Extension {
  JS = 'js',
  TS = 'ts',
  JSX = 'jsx',
  TSX = 'tsx',
  JSON = 'json',
  INVALID = 'invalid',
}

export default function requireConfig(filePath: string): IntegralTorchConfig {
  const clearFilePath = getClearFilePath(filePath)
  const [finalFilePath, ets] = getFileInfo(clearFilePath)
  if (ets === Extension.INVALID) {
    throw new Error(`The config path: ${filePath} is incorrect`)
  }
  if (ets === Extension.JSON) {
    return require(finalFilePath)
  }
  const result = transformFileSync(finalFilePath, {
    ...babelConfig,
    filenameRelative: finalFilePath,
  })
  if (result && result.code) {
    try {
      return runCode(result.code, createContext(finalFilePath))
    } catch (e) {
      throw e
    }
  } else {
    throw new Error(`The file: ${filePath} has syntax error`)
  }
}

function createContext(filepath: string): vm.Context {
  const dir = path.dirname(filepath)
  const module = { exports: {} }
  const virtualRequire = (filePath: string) => {
    if (!isAbsolutePath(filePath)) {
      return requireConfig(path.resolve(dir, filePath))
    } else {
      return require(filePath)
    }
  }
  return vm.createContext({
    ...global,
    global,
    console,
    process,
    __filename: filepath,
    __dirname: dir,
    exports: module.exports,
    require: virtualRequire,
    module: module,
  })
}

function getFileInfo(filePath: string): [string, Extension] {
  const clearFilePath = getClearFilePath(
    filePath,
    getKeys(Extension).map((key) => Extension[key])
  )
  let finalFilePath: string = filePath
  let extension: Extension = Extension.INVALID
  getKeys(Extension).some((etsKey) => {
    let ets = Extension[etsKey]
    if (fs.existsSync(`${clearFilePath}.${ets}`)) {
      finalFilePath = `${clearFilePath}.${ets}`
      extension = ets
      return true
    }
    return false
  })
  return [finalFilePath, extension]
}

function runCode(sourceCode: string, context?: vm.Context) {
  if (context) {
    return vm.runInContext(sourceCode, context)
  }
  return vm.runInThisContext(sourceCode)(require)
}

function getClearFilePath(
  filepath: string,
  extensions: string[] = ['js']
): string {
  function replacer(
    match: string,
    p1: string,
    p2: string,
    offset: number,
    str: string
  ) {
    if (extensions.includes(p2)) {
      return p1
    } else {
      return str
    }
  }
  return filepath.replace(/^(.*)\.([a-zA-Z]{1,5})$/, replacer)
}

function isAbsolutePath(path: string): boolean {
  return path[0] !== '.'
}

function getKeys<T extends {}>(o: T): Array<keyof T> {
  return Object.keys(o) as Array<keyof T>
}
