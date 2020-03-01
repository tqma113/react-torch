// import "core-js/stable"
// import "regenerator-runtime/runtime"
import createRouter from './router'
// @ts-ignore
import $routes from "D:/Projects/JavaScript/react-torch/example/.torch/server/routes"

declare global {
  interface Window {
    // __SRC__: string
    __SSR__: boolean,
    __CONTAINER__: string
  }
}

// const src = window.__SRC__
const ssr = window.__SSR__
const container = window.__CONTAINER__

// const routes = require(src)

const router = createRouter($routes, container, ssr)
router.start()

history.replaceState({ idx: 0 }, '')