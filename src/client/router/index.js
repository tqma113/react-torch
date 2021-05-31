'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.createRouter = void 0
var tslib_1 = require('tslib')
var torch_router_1 = require('torch-router')
var error_1 = require('../../internal/error')
var page_1 = require('../page')
function createRouter(routes) {
  var _this = this
  var router = torch_router_1.createRouter(routes)
  return function (path) {
    return tslib_1.__awaiter(_this, void 0, void 0, function () {
      var matches, _a, pageCreater, _b, transform, params, pctr, err_1
      return tslib_1.__generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            _c.trys.push([0, 5, , 6])
            matches = router(path)
            if (!(matches === null)) return [3 /*break*/, 1]
            return [
              2 /*return*/,
              {
                module: null,
                params: {},
              },
            ]
          case 1:
            ;(_a = matches.module),
              (pageCreater = _a.pageCreater),
              (_b = _a.transform),
              (transform = _b === void 0 ? identify : _b),
              (params = matches.params)
            if (!page_1.isTorchPage(pageCreater)) return [3 /*break*/, 2]
            return [
              2 /*return*/,
              {
                module: { pageCreater: pageCreater, transform: transform },
                params: params,
              },
            ]
          case 2:
            return [4 /*yield*/, dynamic(pageCreater)]
          case 3:
            pctr = _c.sent()
            return [
              2 /*return*/,
              {
                module: { pageCreater: pctr, transform: transform },
                params: params,
              },
            ]
          case 4:
            return [3 /*break*/, 6]
          case 5:
            err_1 = _c.sent()
            return [
              2 /*return*/,
              {
                module: {
                  pageCreater: page_1.createPage(function () {
                    return function () {
                      return error_1.createErrorElement(
                        err_1.stack || err_1.message
                      )
                    }
                  }),
                  transform: identify,
                },
                params: {},
              },
            ]
          case 6:
            return [2 /*return*/]
        }
      })
    })
  }
}
exports.createRouter = createRouter
function dynamic(loader) {
  return tslib_1.__awaiter(this, void 0, void 0, function () {
    var module_1, err_2
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 4, , 5])
          module_1 = loader()
          if (!isPromise(module_1)) return [3 /*break*/, 2]
          return [4 /*yield*/, module_1]
        case 1:
          return [2 /*return*/, _a.sent().default]
        case 2:
          return [2 /*return*/, module_1]
        case 3:
          return [3 /*break*/, 5]
        case 4:
          err_2 = _a.sent()
          return [
            2 /*return*/,
            page_1.createPage(function () {
              return function () {
                return error_1.createErrorElement(err_2.stack || err_2.message)
              }
            }),
          ]
        case 5:
          return [2 /*return*/]
      }
    })
  })
}
function isPromise(input) {
  // @ts-ignore
  return input && input.then && typeof input.then === 'function'
}
function identify(input) {
  return input
}
//# sourceMappingURL=index.js.map
