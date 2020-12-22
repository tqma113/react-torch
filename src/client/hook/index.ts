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

export const useTorchContext = () => {
  const { context } = useContext(GlobalContext)
  return context
}

export const useParams = () => {
  const { params } = useContext(GlobalContext)
  return params
}
