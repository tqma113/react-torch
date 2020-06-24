import 'core-js/stable'
import 'regenerator-runtime/runtime'

import createRouter from './router'
// @ts-ignore
import $routes from "@routes"
import type { TORCH_DATA } from '../index'

declare global {
  interface Window {
    __TORCH_DATA__: TORCH_DATA
    __DEV__: boolean
  }
}
const dataScript = document.getElementById('__TORCH_DATA__') as HTMLScriptElement | null
if (dataScript) {
  const jsonStr = dataScript.textContent
  if (jsonStr) {
    try {
      const data: TORCH_DATA = JSON.parse(jsonStr)

      window.__TORCH_DATA__ = data

      const router = createRouter(
        $routes,
        data.container,
        data.context,
        data.state
      )
      router.init()
      router.start()
    } catch (err) {
      console.log(`Init with data: ${jsonStr} failed!`)
      console.log(err)
    }
  } else {
  }
} else {
  console.error('Render fail. Can\' find __TORCH_DATA__ script element!')
}
