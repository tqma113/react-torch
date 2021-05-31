import {
  createStore as createReduxStore,
  compose,
  Store,
  PreloadedState,
  applyMiddleware,
} from 'redux'
import { createLogger } from 'redux-logger'
import { hooks } from './storeHook'
import { forcePlainDataCheck } from './util'

export type { Store, PreloadedState }

export type ReducerWithoutPayload<S = any> = (state: S) => S
export type ReducerWithPayload<S = any, P = any> = (state: S, payload: P) => S
export type ReducerWithOptionalPayload<S = any, P = any> = (
  state: S,
  payload?: P
) => S

export type Reducer<S = any> =
  | ReducerWithPayload<S>
  | ReducerWithoutPayload<S>
  | ReducerWithOptionalPayload<S>

export type Reducers<S = any> = {
  [key: string]: Reducer<S>
}

export type Tail<T extends any[]> = ((...t: T) => any) extends (
  _: any,
  ...tail: infer TT
) => any
  ? TT
  : []

export type ReducerToAction<R extends Reducer> = R extends (
  ...args: infer Args
) => any
  ? (...args: Tail<Args>) => void
  : never

export type ReducersToActions<RS extends Reducers> = {
  [key in keyof RS]: ReducerToAction<RS[key]>
}

export type CreateStoreOptions<S, RS extends Reducers<S>> = {
  name?: string
  initialState: S
  reducers: RS
  devtools?: boolean
  logger?: boolean
}

export type CreateInternalStoreOptions<S, RS extends Reducers> =
  CreateStoreOptions<S, RS> & {
    preloadedState?: PreloadedState<S>
  }

export type ActionObject = {
  type: string
  payload?: any
}

export const createStore = <S, RS extends Reducers<S>>(
  options: CreateInternalStoreOptions<S, RS>
) => {
  let { reducers, initialState, preloadedState } = options

  /**
   * check initial state in non-production env
   */
  if (process.env.NODE_ENV !== 'production') {
    forcePlainDataCheck(initialState)
  }

  let reducer = (state: S = initialState, action: ActionObject) => {
    /**
     * check action in non-production env
     */
    if (process.env.NODE_ENV !== 'production') {
      forcePlainDataCheck(action)
    }

    let actionType = action.type

    if (!reducers.hasOwnProperty(actionType)) {
      return state
    }

    let update = reducers[actionType]

    let nextState = update(state, action.payload)

    /**
     * check next state in non-production env
     */
    if (process.env.NODE_ENV !== 'production') {
      forcePlainDataCheck(nextState)
    }

    return nextState
  }

  let enhancer = createReduxDevtoolsEnhancer(
    options.devtools,
    options.name,
    options.logger
  )

  let store = createReduxStore(reducer, preloadedState, enhancer)

  let actions = createActions(reducers, store.dispatch)

  return {
    store,
    actions,
  }
}

const createReduxDevtoolsEnhancer = (
  devtools: boolean = true,
  name?: string,
  enableLogger = false
) => {
  let composeEnhancers =
    // tslint:disable-next-line: strict-type-predicates
    devtools &&
    typeof window === 'object' &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          name,
        })
      : compose

  let enhancer = enableLogger
    ? composeEnhancers(applyMiddleware(createLogger()))
    : composeEnhancers()

  return enhancer
}

type Dispatch = (action: ActionObject) => ActionObject

const createActions = <RS extends Reducers>(
  reducers: RS,
  dispatch: Dispatch
): ReducersToActions<RS> => {
  let actions = {} as ReducersToActions<RS>

  for (let actionType in reducers) {
    let reducer = reducers[actionType]
    let action = ((payload: any) => {
      dispatch({
        type: actionType,
        payload: payload,
      })
    }) as ReducerToAction<typeof reducer>

    actions[actionType] = action
  }

  return actions
}

type Stores = {
  [key: string]: Store
}

type StoreStateType<T extends Store> = T extends Store<infer S> ? S : never

type CombinedState<T extends Stores> = {
  [key in keyof T]: StoreStateType<T[key]>
}

type CombinedStore<T extends Stores> = Store<CombinedState<T>>

export const { setupStore, setupStart, setupFinish, setupPreload } = hooks

export function combineStore<T extends Stores>(stores: T): CombinedStore<T> {
  type State = CombinedState<T>
  let initialState = {} as State

  for (let key in stores) {
    initialState[key] = stores[key].getState()
  }

  let { store, actions } = setupStore({
    devtools: false,
    initialState,
    reducers: {
      update: (state: State, [key, value]: [keyof T, T[keyof T]]) => {
        return {
          ...state,
          [key]: value,
        }
      },
    },
  })

  for (let key in stores) {
    stores[key].subscribe(() => {
      actions.update([key, stores[key].getState()])
    })
  }

  return store
}
