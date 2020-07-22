import type { TorchConfig } from '../index'

export type ConfigHook = ((config: TorchConfig) => TorchConfig) | ((config: TorchConfig) => Promise<TorchConfig>)
export type Hook = (() => void) | (() => Promise<void>)

export type LifeCircle = {
  config: ConfigHook,

  willCreate: Hook,
  willMount: Hook
  didMount: Hook
}

type Value<T, Key extends keyof T> = T[Key]

const defaultLifeCircle: LifeCircle = {
  config: (config) => config,
  willCreate: () => {},
  willMount: () => {},
  didMount: () => {}
}

function createHookContext() {
  let _symbol: symbol | null = null
  let dict: Record<symbol, LifeCircle> = {}

  function setPageLifeCircle(symbol: symbol) {
    _symbol = symbol
    dict = {
      ...dict,
      [_symbol]: defaultLifeCircle
    }
  }

  function getLifeCircle(symbol: symbol): LifeCircle {
    // @ts-ignore
    const lifeCircle = dict[symbol]
    // @ts-ignore
    delete dict[symbol]
    _symbol = null
    return lifeCircle
  }

  function setHook<Keys extends keyof LifeCircle, Hook extends Value<LifeCircle, Keys>>(
    name: Keys,
    hook: Hook
  ) {
    if (_symbol == null) {
      console.warn('You can\'t call lifecircle hook at here.')
    } else {
      // @ts-ignore
      dict[_symbol][name] = hook
    }
  }

  return {
    setPageLifeCircle,
    getLifeCircle,
    setHook
  }
}

const context = createHookContext()

export function setPageLifeCircle(symbol: symbol) {
  context.setPageLifeCircle(symbol)
}

export function getLifeCircle(symbol: symbol) {
  return context.getLifeCircle(symbol)
}

export function setHook<Keys extends keyof LifeCircle, Hook extends Value<LifeCircle, Keys>>(
  name: Keys,
  hook: Hook
) {
  context.setHook(name, hook)
}