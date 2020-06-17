import 'core-js/stable'
import 'regenerator-runtime/runtime'

import createRouter from './router'
// @ts-ignore
import $routes from "@routes"

declare global {
  interface Window {
    __CONTEXT__: string
    __CONTAINER__: string
    __STATE__: string
    __DEV__: boolean
  }
}

const context = JSON.parse(window.__CONTEXT__)
const container = window.__CONTAINER__
const state = JSON.parse(window.__STATE__)

const router = createRouter($routes, container, context, state)
router.init()
router.start()
