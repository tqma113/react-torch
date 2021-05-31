import { useContext, useEffect, useState, useReducer } from 'react'

import GlobalContext from '../context'
import type { StoreLike } from '../store'
export { usePageSetup } from '../../internal/hook'

export const useLocation = () => {
  const { location } = useContext(GlobalContext)
  return location
}

export const useHistory = () => {
  const { history } = useContext(GlobalContext)
  return history
}

export const useTorchContext = () => {
  const { context } = useContext(GlobalContext)
  return context
}

export const useParams = () => {
  const { params } = useContext(GlobalContext)
  return params
}

export const useStore = <S extends StoreLike<any>>() => {
  const { store } = useContext(GlobalContext)
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
  const { store } = useContext(GlobalContext)

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
