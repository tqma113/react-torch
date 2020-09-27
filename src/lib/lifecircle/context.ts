import type { LifeCircleCache, LifeCircle, Value } from './index'

const TORCH_HOOK_SYMBOL_TEXT = 'TORCH_HOOK_SYMBOL'

const defaultLifeCircleFactory: () => LifeCircleCache = () => ({
  config: [],
  willCreate: [],
  willMount: [],
  didMount: [],
})

function createHookContext() {
  let __symbol__: symbol | null = null
  let dict: Record<symbol, LifeCircle> = {}

  function setLifeCircle() {
    __symbol__ = Symbol(TORCH_HOOK_SYMBOL_TEXT)
    dict = {
      ...dict,
      [__symbol__]: defaultLifeCircleFactory(),
    }
    return __symbol__
  }

  function getLifeCircle(symbol: symbol): LifeCircleCache {
    // @ts-ignore
    const lifeCircle = dict[symbol]
    // @ts-ignore
    delete dict[symbol]
    __symbol__ = null
    return lifeCircle
  }

  function setHook<
    Keys extends keyof LifeCircle,
    Hook extends Value<LifeCircle, Keys>
  >(name: Keys, hook: Hook) {
    if (__symbol__ == null) {
      console.trace("You can't call lifecircle hook at here.")
    } else {
      // @ts-ignore
      dict[__symbol__][name].push(hook)
    }
  }

  return {
    setLifeCircle,
    getLifeCircle,
    setHook,
  }
}

export default createHookContext()
