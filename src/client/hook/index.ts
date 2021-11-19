import { useContext, useEffect, useState, useReducer } from 'react'

import GlobalContext from '../context'
import type { StoreLike } from '../store'
export { usePageSetup } from '../../internal/hook'

export const useLocation = () => {
  const context = useContext(GlobalContext)

  if (!context) {
    throw new Error(
      `Can't get the context value, please make sure that calling the 'useLocation' in 'Provider'`
    )
  }

  const { location } = context
  return location
}

export const useHistory = () => {
  const context = useContext(GlobalContext)

  if (!context) {
    throw new Error(
      `Can't get the context value, please make sure that calling the 'useLocation' in 'Provider'`
    )
  }

  const { history } = context
  return history
}

export const useTorchContext = () => {
  const context = useContext(GlobalContext)

  if (!context) {
    throw new Error(
      `Can't get the context value, please make sure that calling the 'useTorchContext' in 'Provider'`
    )
  }

  const { context: torchContext } = context
  return torchContext
}

export const useParams = () => {
  const context = useContext(GlobalContext)

  if (!context) {
    throw new Error(
      `Can't get the context value, please make sure that calling the 'useParams' in 'Provider'`
    )
  }

  const { params } = context
  return params
}

export const useStore = <S extends StoreLike<any>>() => {
  const context = useContext(GlobalContext)

  if (!context) {
    throw new Error(
      `Can't get the context value, please make sure that calling the 'useStore' in 'Provider'`
    )
  }

  const { store } = context
  const [state, setState] = useState(null)
  const [, forceRender] = useReducer((s) => s + 1, 0)

  const update = () => {
    const curState = store.getState()
    if (!Object.is(curState, state)) {
      forceRender()
    }
  }

  useEffect(() => {
    setState(store.getState())
    store.subscribe(update)
  }, [])

  return store as S
}

export type Selector<S, R> = (state: S) => R
export const useSelector = <S, R>(select: Selector<S, R>) => {
  const context = useContext(GlobalContext)

  if (!context) {
    throw new Error(
      `Can't get the context value, please make sure that calling the 'useSelector' in 'Provider'`
    )
  }

  const { store } = context

  const [state, setState] = useState<R>(null as any as R)
  const [, forceRender] = useReducer((s) => s + 1, 0)

  const update = () => {
    const curState = select(store.getState())
    if (!Object.is(curState, state)) {
      forceRender()
    }
  }

  useEffect(() => {
    setState(select(store.getState()))
    store.subscribe(update)
  }, [])

  return state
}
