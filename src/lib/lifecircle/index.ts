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

export function setLifeCircle() {
  return context.setLifeCircle()
}

type Arg<H> = H extends (arg: infer Arg) => any ? Arg : never

async function walkHooksWithArg<H extends (arg: any) => any>(
  hooks: Array<H>,
  arg: Arg<H>
): Promise<Arg<H>> {
  if (hooks.length === 0) {
    return arg
  }

  const nextArg = await hooks[0](arg)
  return await walkHooksWithArg(hooks.slice(1), nextArg)
}

async function walkHooks<H extends () => any>(hooks: Array<H>): Promise<void> {
  if (hooks.length === 0) {
    return
  }

  await hooks[0]()
  await walkHooks(hooks.slice(1))
}

export function getLifeCircle(symbol: symbol): LifeCircle {
  const cache = context.getLifeCircle(symbol)

  const config: ConfigHook = async (config) => {
    return walkHooksWithArg(cache.config, config)
  }

  const willCreate: Hook = async () => {
    return walkHooks(cache.willCreate)
  }

  const willMount: Hook = async () => {
    return walkHooks(cache.willMount)
  }

  const didMount: Hook = async () => {
    return walkHooks(cache.didMount)
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
