exports.ids = [1];
exports.modules = {

/***/ "./Home/Model.ts":
/*!***********************!*\
  !*** ./Home/Model.ts ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../store */ "../../store/index.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


var initialState = {
  count: 0
};
var actions = {
  UPDATE_COUNT: function UPDATE_COUNT(state, nextCount) {
    return _objectSpread({}, state, {
      count: nextCount
    });
  },
  INCREASE: function INCREASE(state) {
    return _objectSpread({}, state, {
      count: state.count + 1
    });
  },
  DECREASE: function DECREASE(state) {
    return _objectSpread({}, state, {
      count: state.count - 1
    });
  }
};
var store = Object(_store__WEBPACK_IMPORTED_MODULE_0__["createStore"])(initialState, actions);
/* harmony default export */ __webpack_exports__["default"] = (store);

/***/ }),

/***/ "./Home/View.tsx":
/*!***********************!*\
  !*** ./Home/View.tsx ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

/* harmony default export */ __webpack_exports__["default"] = (function (_ref) {
  var state = _ref.state;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, "about ", state.count);
});

/***/ }),

/***/ "./Home/index.ts":
/*!***********************!*\
  !*** ./Home/index.ts ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../index */ "../../index.ts");
/* harmony import */ var _Model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Model */ "./Home/Model.ts");
/* harmony import */ var _View__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./View */ "./Home/View.tsx");



var Home = Object(_index__WEBPACK_IMPORTED_MODULE_0__["createPage"])(_View__WEBPACK_IMPORTED_MODULE_2__["default"], _Model__WEBPACK_IMPORTED_MODULE_1__["default"]);
/* harmony default export */ __webpack_exports__["default"] = (Home);

/***/ })

};;
//# sourceMappingURL=1.routes.js.map