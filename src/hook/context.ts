import { useContext } from 'react'
import GlobalContext from '../context'
import type { Store, Actions, Currings } from '../store'

export const useLocation = () => {
  const { location } = useContext(GlobalContext)
  return location
}

export const useHistory = () => {
  const { history } = useContext(GlobalContext)
  return history
}

export const useStore = <
  S extends object,
  AS extends Actions<S>
>() => {
  const { store } = useContext(GlobalContext)
  return store as Store<S, AS>
}

export const useState = <S extends object>() => {
  const { store } = useContext(GlobalContext)
  return store.state as S
}

export const useActions = <
  S extends object,
  AS extends Actions<S>
>() => {
  const { store } = useContext(GlobalContext)
  return store.actions as Currings<S, AS>
}