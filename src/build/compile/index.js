'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
var tslib_1 = require('tslib')
var webpack_1 = tslib_1.__importDefault(require('webpack'))
var webpackConfig_1 = tslib_1.__importDefault(require('./webpackConfig'))
var utils_1 = require('../../internal/utils')
function compileClient(config, packContext) {
  var webpackConfig = config.transformWebpackConfig(
    webpackConfig_1.default(config),
    packContext,
    config
  )
  utils_1.step('\nCompiling client...')
  return new Promise(function (resolve, reject) {
    webpack_1.default(webpackConfig, function (error, stats) {
      if (error) {
        reject(error)
      } else {
        console.log(
          '[webpack:client:build]',
          stats.toString({
            colors: true,
          })
        )
        utils_1.info('\nCompile client finish!\n')
        resolve()
      }
    })
  })
}
exports.default = compileClient
//# sourceMappingURL=index.js.map
