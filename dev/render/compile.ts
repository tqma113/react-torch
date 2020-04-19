import vm from 'vm'
import fs from 'fs'
import path from 'path'
import webpack from 'webpack'
import getConfig from './config'
import { matchExternals, getExternals } from './utils'
import { Router } from './router'

export default function compile(dir: string, router: Router) {
  const config = getConfig(dir)
  const compiler = webpack(config)

  compiler.watch({}, (err, stats) => {
    if (err) throw err

    const statsObj = stats.toJson()
    statsObj.errors.forEach(console.error)
    statsObj.warnings.forEach(console.warn)

    const rootPath = path.resolve(dir, '.torch', 'server')
    const externals = getExternals(dir)

    function virtualRequire(modulePath: string) {
      if (matchExternals(externals, modulePath)) {
        return require(modulePath)
      }
      let filePath = path.join(rootPath, modulePath)
      let sourceCode = ''
      let moduleResult = 'default'

      try {
        sourceCode = fs.readFileSync(filePath, 'utf-8')
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

    function runCode(sourceCode: string) {
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

    const outputPath = path.join(dir, '.torch', 'server', 'routes.js')
    const sourceCode: string = fs.readFileSync(outputPath, 'utf-8')
    const newModule = runCode(sourceCode)
    if (newModule) {
      const routes = newModule.default || newModule
      router.setRoutes(routes)
		}
  })
}