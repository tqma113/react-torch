import { useContext } from 'react'
import GlobalContext from '../context'

export const useLocation = () => {
  const { location } = useContext(GlobalContext)
  return location
}

export const useHistory = () => {
  const { history } = useContext(GlobalContext)
  return history
}

export const useStore = () => {
  const { store } = useContext(GlobalContext)
  return store
}

export const useState = () => {
  const { store } = useContext(GlobalContext)
  return store.state
}

export const useActions = () => {
  const { store } = useContext(GlobalContext)
  return store.actions
}