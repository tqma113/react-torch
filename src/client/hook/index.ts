import { useContext } from 'react'
import Cookie from 'js-cookie'

import GlobalContext from '../context'

import type { CookieAttributes } from 'js-cookie'

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

export const useCookie = () => {
  const get = (key: string) => {
    return Cookie.get(key)
  }

  const set = (
    key: string,
    value: string,
    options?: Cookie.CookieAttributes
  ) => {
    if (options && options.expires) {
      let isDateInstance = options.expires instanceof Date
      if (!isDateInstance) {
        throw new Error(
          `cookie 的过期时间 expires 必须为 Date 的实例，而不是 ${options.expires}`
        )
      }
    }

    Cookie.set(key, value, options)
  }

  const remove = (key: string, options?: CookieAttributes) => {
    Cookie.remove(key, options)
  }

  return {
    get,
    set,
    remove,
  }
}
