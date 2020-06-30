import { setHook } from '../lifecircle'
import type { TorchConfig } from '../index'

export function useConfig(hook: (config: TorchConfig) => TorchConfig) {
  setHook('config', hook)
}

export function useWillCreate(hook: () => void) {
  setHook('willCreate', hook)
}

export function useWillRend(hook: () => void) {
  setHook('willRend', hook)
}

export function useWillMount(hook: () => void) {
  setHook('willMount', hook)
}

export function useDidMount(hook: () => void) {
  setHook('didMount', hook)
}