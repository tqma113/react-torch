import type { LifeCircleCache, LifeCircle, Value } from './index'

const defaultLifeCircleFactory: () => LifeCircleCache = () => ({
  config: [],
  willCreate: [],
  willMount: [],
  didMount: []
})

function createHookContext() {
  let _symbol: symbol | null = null
  let dict: Record<symbol, LifeCircle> = {}

  function setPageLifeCircle() {
    _symbol = Symbol('TORCH_PAGE')
    dict = {
      ...dict,
      [_symbol]: defaultLifeCircleFactory()
    }
    return _symbol
  }

  function getLifeCircle(symbol: symbol): LifeCircleCache {
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
      console.trace('You can\'t call lifecircle hook at here.')
    } else {
      // @ts-ignore
      dict[_symbol][name].push(hook)
    }
  }

  return {
    setPageLifeCircle,
    getLifeCircle,
    setHook
  }
}

export default createHookContext()