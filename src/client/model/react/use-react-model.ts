import {
  useState as useReactState,
  useMemo,
  useEffect,
  useLayoutEffect,
} from 'react'
import {
  createPureModel,
  CreatePureModelOptions,
  InitializerActions,
  InitializerState,
  Model,
} from '../core'
import type { ReactModel, ReactModelInitilizer } from './create-react-model'

const useIsomorphicLayoutEffect =
  // tslint:disable-next-line: strict-type-predicates
  typeof window !== 'undefined' &&
  // tslint:disable-next-line: strict-type-predicates
  typeof window.document !== 'undefined' &&
  // tslint:disable-next-line: deprecation & strict-type-predicates
  typeof window.document.createElement !== 'undefined'
    ? useLayoutEffect
    : useEffect

export const useReactModel = <RM extends ReactModel>(
  ReactModel: RM,
  options?: CreatePureModelOptions<ReactModelInitilizer<RM>> & {
    onError?: (error: Error) => any
  }
): [
  InitializerState<ReactModelInitilizer<RM>>,
  InitializerActions<ReactModelInitilizer<RM>>
] => {
  let model = useMemo(() => {
    let model = createPureModel(ReactModel.create, options as any)
    return model as Model
  }, [])

  let [state, setState] = useReactState(
    () => model.store.getState() as InitializerState<ReactModelInitilizer<RM>>
  )

  useIsomorphicLayoutEffect(() => {
    let isUnmounted = false

    let unsubscribe = model.store.subscribe(() => {
      setState(model.store.getState())
    })

    if (!model.preload.hasRun()) {
      model.preload
        .run()
        .then(() => {
          if (isUnmounted) return
          model.start.run()
        })
        .catch(options?.onError)
    } else if (!model.start.hasRun()) {
      model.start.run()
    }

    return () => {
      isUnmounted = true
      unsubscribe()
      if (model.start.hasRun()) {
        model.finish.run()
      }
    }
  }, [])

  return [state, model.actions as InitializerActions<ReactModelInitilizer<RM>>]
}
