import React, {
  useContext,
  useState as useReactState,
  useReducer,
  useLayoutEffect,
  useEffect,
  useMemo,
  useRef,
} from 'react'

import {
  Store,
  Initializer,
  Model,
  InitializerState,
  InitializerActions,
  createPureModel,
  identity,
  shallowEqual,
} from '../core'

const useIsomorphicLayoutEffect =
  // tslint:disable-next-line: strict-type-predicates
  typeof window !== 'undefined' &&
  // tslint:disable-next-line: strict-type-predicates
  typeof window.document !== 'undefined' &&
  // tslint:disable-next-line: deprecation & strict-type-predicates
  typeof window.document.createElement !== 'undefined'
    ? useLayoutEffect
    : useEffect

export type ReactModel<I extends Initializer = any> = {
  isReactModel: boolean
  useState: <TSelected = InitializerState<I>>(
    selector?: (state: InitializerState<I>) => TSelected,
    compare?: (curr: TSelected, prev: TSelected) => boolean
  ) => TSelected
  useActions: () => InitializerActions<I>
  Provider: React.FC<{
    model?: Model<InitializerState<I>>
    preloadedState?: InitializerState<I>
  }>
  preload: (preloadedState?: InitializerState<I>) => Promise<{
    Provider: React.FC
    state: InitializerState<I>
    model: Model<InitializerState<I>>
  }>
  create: I
}

export type ReactModelInitilizer<RM extends ReactModel> = RM extends ReactModel<
  infer I
>
  ? I
  : never

export type ReactModelState<RM extends ReactModel> = InitializerState<
  ReactModelInitilizer<RM>
>

const DefaultValue = Symbol('default-value')

type DefaultValue = typeof DefaultValue

export const createReactModel = <I extends Initializer>(
  initilizer: I
): ReactModel<I> => {
  type State = InitializerState<I>
  type Value = {
    store: Store<State>
    actions: InitializerActions<I>
  }

  let ReactContext = React.createContext<Value | null>(null)

  let useState: ReactModel<I>['useState'] = (
    selector = identity,
    compare = shallowEqual
  ) => {
    type Selector = typeof selector
    type SelectedState = ReturnType<Selector>
    let ctx = useContext(ReactContext)

    if (ctx === null) {
      throw new Error(
        `You may forget to attach Provider to component tree before calling Model.useState()`
      )
    }

    let { store } = ctx
    // modified from react-redux useSelector
    let [_, forceRender] = useReducer((s) => s + 1, 0)

    let latestSubscriptionCallbackError = useRef<Error | null>(null)
    let latestSelector = useRef<Selector | null>(null)
    let latestStoreState = useRef<State | DefaultValue>(DefaultValue)
    let latestSelectedState = useRef<SelectedState | DefaultValue>(DefaultValue)

    let storeState = store.getState()
    let selectedState: SelectedState | DefaultValue = DefaultValue

    try {
      if (
        selector !== latestSelector.current ||
        storeState !== latestStoreState.current ||
        latestSubscriptionCallbackError.current
      ) {
        selectedState = selector(storeState)
      } else {
        selectedState = latestSelectedState.current
      }
    } catch (err) {
      if (latestSubscriptionCallbackError.current && err instanceof Error) {
        err.message += `\nThe error may be correlated with this previous error:\n${latestSubscriptionCallbackError.current.stack}\n\n`
      }

      throw err
    }

    useIsomorphicLayoutEffect(() => {
      latestSelector.current = selector
      latestStoreState.current = storeState
      latestSelectedState.current = selectedState
      latestSubscriptionCallbackError.current = null
    })

    useIsomorphicLayoutEffect(() => {
      let isUnmounted = false
      let checkForUpdates = () => {
        if (!latestSelector.current) return
        if (isUnmounted) return

        if (latestSelectedState.current === DefaultValue) {
          throw new Error(`latestSelectedState should not be default value`)
        }

        try {
          let storeState = store.getState()
          let newSelectedState = latestSelector.current(storeState)

          if (compare(newSelectedState, latestSelectedState.current)) {
            return
          }

          latestSelectedState.current = newSelectedState
          latestStoreState.current = storeState
        } catch (err) {
          // we ignore all errors here, since when the component
          // is re-rendered, the selectors are called again, and
          // will throw again, if neither props nor store state
          // changed
          if (err instanceof Error) {
            latestSubscriptionCallbackError.current = err
          } else {
            throw err
          }
        }

        forceRender()
      }
      let unsubscribe = store.subscribe(checkForUpdates)

      return () => {
        isUnmounted = true
        unsubscribe()
      }
    }, [store])

    if (selectedState === DefaultValue) {
      throw new Error(`selectedState should not be default value`)
    }

    return selectedState
  }

  let useActions = () => {
    let ctx = useContext(ReactContext)
    if (ctx === null) {
      throw new Error(
        `You may forget to attach Provider to component tree before calling Model.useActions()`
      )
    }
    return ctx.actions
  }

  let Provider: ReactModel<I>['Provider'] = (props) => {
    let { children, preloadedState } = props

    let model = useMemo(() => {
      if (props.model) return props.model
      let options = { preloadedState }
      return createPureModel(initilizer, options)
    }, [])

    let value = useMemo(() => {
      return {
        store: model.store,
        actions: model.actions,
      }
    }, [model])

    let [isReady, setReady] = useReactState(() => {
      return model.preload.hasRun()
    })

    useIsomorphicLayoutEffect(() => {
      let isUnmounted = false

      if (!model.preload.hasRun()) {
        // tslint:disable-next-line: no-floating-promises
        model.preload.run().then(() => {
          if (isUnmounted) return
          setReady(true)
          model.start.run()
        })
      } else if (!model.start.hasRun()) {
        model.start.run()
      }

      return () => {
        isUnmounted = true
        if (model.start.hasRun()) {
          model.finish.run()
        }
      }
    }, [])

    if (!isReady) return null

    return (
      <ReactContext.Provider value={value as Value}>
        {children}
      </ReactContext.Provider>
    )
  }

  let preload: ReactModel<I>['preload'] = async (preloadedState) => {
    let model = createPureModel(initilizer, { preloadedState })

    await model.preload.run()

    let state = model.store.getState()

    let PreloadedProvider: React.FC = ({ children }) => {
      return <Provider model={model}>{children}</Provider>
    }

    return { Provider: PreloadedProvider, state, model }
  }

  return {
    isReactModel: true,
    useState,
    useActions,
    Provider,
    preload,
    create: initilizer,
  }
}
