import { setHook } from '../lifecycle'
import type { ConfigHook, Hook } from '../lifecycle'

export function useConfig(hook: ConfigHook) {
  setHook('config', hook)
}

export function useWillCreate(hook: Hook) {
  setHook('willCreate', hook)
}

export function useWillMount(hook: Hook) {
  setHook('willMount', hook)
}

export function useDidMount(hook: Hook) {
  setHook('didMount', hook)
}
