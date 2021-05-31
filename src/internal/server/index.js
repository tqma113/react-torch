'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
var tslib_1 = require('tslib')
var express_1 = tslib_1.__importDefault(require('express'))
var morgan_1 = tslib_1.__importDefault(require('morgan'))
var cookie_parser_1 = tslib_1.__importDefault(require('cookie-parser'))
var compression_1 = tslib_1.__importDefault(require('compression'))
var serve_favicon_1 = tslib_1.__importDefault(require('serve-favicon'))
var helmet_1 = tslib_1.__importDefault(require('helmet'))
var body_parser_1 = tslib_1.__importDefault(require('body-parser'))
function createServer(config) {
  var isDev = process.env.NODE_ENV === 'development'
  var loggerFormat = isDev ? 'dev' : 'common'
  var cookieParserSecret = isDev ? 'torch' : '__TORCH__'
  var app = express_1.default()
  // helmet
  app.use(helmet_1.default())
  // compression
  app.use(compression_1.default())
  // favicon
  if (config.favicon) {
    app.use(serve_favicon_1.default(config.favicon))
  }
  // logger
  app.use(morgan_1.default(loggerFormat))
  // body parser
  app.use(body_parser_1.default.json())
  app.use(body_parser_1.default.urlencoded({ extended: false }))
  // cookie parser
  app.use(cookie_parser_1.default(cookieParserSecret))
  return app
}
exports.default = createServer
//# sourceMappingURL=index.js.map
