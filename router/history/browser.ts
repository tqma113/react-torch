import { Action } from './constants'
import { resolveURL } from './url'

export default function createBrowserHistory() {
  let index = 0

  window.onpopstate = handlePop

  function handlePop(event: PopStateEvent) {
    const action = Action.POP
  }

  function getCurrentURL() {
    const url = window.location.href
    return resolveURL(url)
  }

  return {
    get length(): number {
      return window.history.length
    },
    get index(): number {
      return index
    },
    // `PUSH` type action
    push(path: string) {
      const action = Action.PUSH
    },
    // `REPLACE` type action
    replace(path: string) {
      const action = Action.REPLACE
    },
    // `POP` type action
    go(delta?: number) {
      window.history.go(delta)
    },
    back() {
      window.history.back()
    },
    forward() {
      window.history.forward()
    }
  }
}