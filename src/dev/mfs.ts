import vm from 'vm'
import MFS from 'memory-fs'

const createMFSGetter = () => {
  let mfs: MFS = new MFS()

  return (): MFS => {
    return mfs as MFS
  }
}

export const getMFS = createMFSGetter()

const runCode = (sourceCode: string) => {
  return vm.runInThisContext(`
    (function(require) {
      var module = {exports: {}}
              var factory = function(require, module, exports) {
                  ${sourceCode}
              }
              try {
                  factory(require, module, module.exports)
              } catch(error) {
                  return null
              }
              return module.exports
    })
  `)(virtualRequire)
}

export const virtualRequire = (modulePath: string) => {
  const mfs = getMFS()
  let sourceCode = ''
  let moduleResult = 'default'

  try {
    sourceCode = mfs.readFileSync(modulePath, 'utf-8')
  } catch (_) {
    /**
     * externals 和 mfs 里没有这个文件
     * 它可能是 node.js 原生模块
     */
    moduleResult = require(modulePath)
  }

  if (sourceCode) {
    moduleResult = runCode(sourceCode)
  }

  if (moduleResult === 'default') {
    throw new Error(`${modulePath} not found in server webpack compiler`)
  }

  return moduleResult
}