exports.ids = [0];
exports.modules = {

/***/ "./About/Model.ts":
/*!************************!*\
  !*** ./About/Model.ts ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../store */ "../../store/index.ts");

var initialState = {// count: 0
};
var actions = {// UPDATE_COUNT(state: State, nextCount: number) {
  //   return {
  //     ...state,
  //     count: nextCount
  //   }
  // },
  // INCREASE(state: State) {
  //   return {
  //     ...state,
  //     count: state.count + 1
  //   }
  // },
  // DECREASE(state: State) {
  //   return {
  //     ...state,
  //     count: state.count - 1
  //   }
  // },
};
var store = Object(_store__WEBPACK_IMPORTED_MODULE_0__["createStore"])(initialState, actions);
/* harmony default export */ __webpack_exports__["default"] = (store);

/***/ }),

/***/ "./About/View.tsx":
/*!************************!*\
  !*** ./About/View.tsx ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

/* harmony default export */ __webpack_exports__["default"] = (function () {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, "about");
});

/***/ }),

/***/ "./About/index.ts":
/*!************************!*\
  !*** ./About/index.ts ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../index */ "../../index.ts");
/* harmony import */ var _Model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Model */ "./About/Model.ts");
/* harmony import */ var _View__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./View */ "./About/View.tsx");



var About = Object(_index__WEBPACK_IMPORTED_MODULE_0__["createPage"])(_View__WEBPACK_IMPORTED_MODULE_2__["default"], _Model__WEBPACK_IMPORTED_MODULE_1__["default"]);
/* harmony default export */ __webpack_exports__["default"] = (About);

/***/ })

};;
//# sourceMappingURL=0.routes.js.map