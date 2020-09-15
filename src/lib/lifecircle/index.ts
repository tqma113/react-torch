import context from './context'
import type { TorchConfig } from '../../index'

export type ConfigHook =
  | ((config: TorchConfig) => TorchConfig)
  | ((config: TorchConfig) => Promise<TorchConfig>)
export type Hook = (() => void) | (() => Promise<void>)

export type LifeCircleCache = {
  config: ConfigHook[]

  willCreate: Hook[]
  willMount: Hook[]
  didMount: Hook[]
}

export type LifeCircle = {
  config: ConfigHook

  willCreate: Hook
  willMount: Hook
  didMount: Hook
}

export type Value<T, Key extends keyof T> = T[Key]

export function setPageLifeCircle() {
  return context.setPageLifeCircle()
}

export function getLifeCircle(symbol: symbol): LifeCircle {
  const cache = context.getLifeCircle(symbol)

  const config: ConfigHook = async (config) => {
    cache.config.forEach(async (hook) => {
      config = await hook(config)
    })

    return config
  }

  const willCreate: Hook = async () => {
    cache.willCreate.forEach(async (hook) => {
      await hook()
    })
  }

  const willMount: Hook = async () => {
    cache.willMount.forEach(async (hook) => {
      await hook()
    })
  }

  const didMount: Hook = async () => {
    cache.didMount.forEach(async (hook) => {
      await hook()
    })
  }

  return {
    config,
    willCreate,
    willMount,
    didMount,
  }
}

export function setHook<
  Keys extends keyof LifeCircle,
  Hook extends Value<LifeCircle, Keys>
>(name: Keys, hook: Hook) {
  context.setHook(name, hook)
}
