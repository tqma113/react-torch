import { useContext } from 'react'
import Cookie from 'js-cookie'
import GlobalContext from '../context'
import type { CookieAttributes } from 'js-cookie'
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

export const useTorchContext = () => {
  const { context } = useContext(GlobalContext)
  return context
}

export const useCookie = () => {
  const { context } = useContext(GlobalContext)

  const get = (key: string) => {
    if (context.side == 'server') {
      return context.req.cookies?.[key]
    } else {
      Cookie.get(key)
    }
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
          `cookie 的过期时间 expires 必须为 Date 的实例，而不是 ${
          options.expires
          }`
        )
      }
    }

    if (context.side == 'server') {
      context.res.cookie(key, value, options as any)
    } else {
      Cookie.set(key, value, options)
    }
  }

  const remove = (key: string, options?: CookieAttributes) => {
    if (context.side == 'server') {
      context.res.clearCookie(key, options)
    } else {
      Cookie.remove(key, options)
    }
  }

  return {
    get,
    set,
    remove
  }
}