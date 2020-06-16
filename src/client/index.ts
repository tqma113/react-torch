import 'core-js/stable'
import 'regenerator-runtime/runtime'

import createRouter from './router'
// @ts-ignore
import $routes from "@routes"
console.log($routes)

declare global {
  interface Window {
    __SSR__: boolean,
    __CONTAINER__: string
    __STATE__: string
  }
}

const ssr = Boolean(window.__SSR__)
const container = window.__CONTAINER__
const state = JSON.parse(window.__STATE__)

const router = createRouter($routes, container, ssr, state)
router.start()

history.pushState({ idx: 0 }, '')
history.back()