import vm from 'vm'
import fs from 'fs'
import path from 'path'
import webpack from 'webpack'
import { Request, Response, NextFunction } from 'express'
import getConfig from './config'
import { matchExternals } from './utils'
import createRouter from './router/index';

export default function render (dir: string) {
  const config = getConfig(dir)
  const compiler = webpack(config)
  const router = createRouter([])

  compiler.watch({}, (err, stats) => {
    if (err) throw err

    const statsObj = stats.toJson()
    statsObj.errors.forEach(console.error)
    statsObj.warnings.forEach(console.warn)

    const outputPath = path.join(dir, '.torch', 'server', 'routes.js')
    const sourceCode: string = fs.readFileSync(outputPath, 'utf-8')
    const newModule = runCode(sourceCode)
    if (newModule) {
      const routes = newModule.default || newModule
      router.updateRoutes(routes)
		}
  })

  return function (req: Request, res: Response, next: NextFunction) {
    const render = (content: string) => {
      const data = {
        src: path.resolve(dir, '.torch', 'server', 'routes'),
        publicPath: '/static',
        ssr: true,
        content,
        container: 'root'
      }
      res.render('view', data)
    }
    router.tryRender(req.url, render)
  }
}

function virtualRequire(modulePath: string, rootPath: string, externals: string[]) {
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