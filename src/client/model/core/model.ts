import { createStore } from './store'
import { createLifeCircleManager } from './lifecircle'
import { run } from './store-hook'
import { isPlainObject, shallowEqual } from './util'
import type { Reducers, CreateStoreOptions } from './store'
import type { Store, PreloadedState } from 'redux'

type AnyFn = (...args: any) => any

type Actions = {
  [key: string]: AnyFn | Actions
}

export type Initializer<S = any> = (...args: any) => {
  store: Store<S>
  actions: Actions
}

export type InitializerState<I extends Initializer> = I extends (
  ...args: any
) => {
  store: Store<infer S>
  actions: Actions
}
  ? S
  : never

export type InitializerActions<I extends Initializer> = I extends (
  ...args: any
) => {
  store: Store
  actions: infer A
}
  ? A
  : never

export type CreatePureModelOptions<I extends Initializer> = {
  preloadedState?: PreloadedState<InitializerState<I>>
}

export const createPureModel = <I extends Initializer>(
  initializer: I,
  options: CreatePureModelOptions<I> = {}
) => {
  let { preload, start, finish } = createLifeCircleManager()

  let hasStore = false

  let setupStore = <S, RS extends Reducers<S>>(
    storeOptions: CreateStoreOptions<S, RS>
  ) => {
    if (hasStore) {
      throw new Error(
        `Expected calling setupStore only once in initializer: ${initializer.toString()}`
      )
    }

    hasStore = true

    return createStore({
      devtools: true,
      ...storeOptions,
      preloadedState: options.preloadedState,
    })
  }

  let implementations = {
    setupStore: setupStore,
    setupPreload: preload.setup,
    setupStart: start.setup,
    setupFinish: finish.setup,
  }

  let result = run(() => {
    let result = initializer()

    if (!result) {
      throw new Error(
        `Expected initialzer returning { store, actions }, but got ${result}`
      )
    }

    let { store, actions } = result

    if (!store) {
      throw new Error(
        `Expected initialzer returning { store, actions }, but got a invalid store: ${store}`
      )
    }

    if (!actions) {
      throw new Error(
        `Expected initialzer returning { store, actions }, but got a invalid actions: ${actions}`
      )
    }

    return { store, actions } as ReturnType<I>
  }, implementations)

  return {
    ...result,
    preload,
    start,
    finish,
  }
}

export type Model<S = any> = {
  store: Store<S>
  actions: Actions
} & ReturnType<typeof createLifeCircleManager>

export function subscribe<S>(model: Model<S>, listener: (state: S) => void) {
  let unsubscribe = model.store.subscribe(() => {
    if (!model.start.hasRun()) {
      return
    }

    let state = model.store.getState()
    listener(state)
  })

  return unsubscribe
}

export function select<S, TSelected = unknown>(options: {
  model: Model<S>
  selector: (state: S) => TSelected
  listener: (state: TSelected) => void
  compare?: (curr: TSelected, prev: TSelected) => boolean
}) {
  if (!isPlainObject(options)) {
    throw new Error(
      `Expected subscribe(options) recieved { store, listener, selector?, compare? }, instead of ${options}`
    )
  }

  let { model, selector, listener, compare = shallowEqual } = options

  let prevState = selector(model.store.getState())

  let unsubscribe = model.store.subscribe(() => {
    if (!model.start.hasRun()) {
      return
    }

    let state = model.store.getState()
    let currState = selector(state)

    if (!compare(currState, prevState)) {
      prevState = currState
      listener(currState)
    } else {
      prevState = currState
    }
  })

  return unsubscribe
}
