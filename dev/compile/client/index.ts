// import "core-js/stable"
// import "regenerator-runtime/runtime"
import createRouter from './router'
// @ts-ignore
import $routes from "@routes"

declare global {
  interface Window {
    __SSR__: boolean,
    __CONTAINER__: string
  }
}

const ssr = window.__SSR__
const container = window.__CONTAINER__

const router = createRouter($routes, container, ssr)
router.start()
