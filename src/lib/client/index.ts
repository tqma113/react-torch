import ReactDOM from 'react-dom'
import { createBrowserHistory } from 'torch-history'
import createRouter from '../router'
import { connect } from '../context'
import { createErrorElement } from '../error'
import $routes from '@routes'
import type { Listener } from 'torch-history'
import type { TorchData } from '../../index'
import type { GlobalContextType } from '../context'
import type { StoreLike } from '../store'
import type { Page } from '../page'
import type { Render } from '../router'

try {
  const dataScript = document.getElementById(
    '__TORCH_DATA__'
  ) as HTMLScriptElement | null
  if (dataScript === null) {
    throw new Error("SSR failed. Can' find __TORCH_DATA__ script element!")
  }

  const jsonStr = dataScript.textContent
  if (jsonStr === null) {
    throw new Error('SSR failed!')
  }

  const { context, container, state }: TorchData = JSON.parse(jsonStr)

  const containerElement = document.querySelector(`#${container}`)
  if (containerElement === null) {
    throw new Error(`The container: ${container} is not exist`)
  }

  const history = createBrowserHistory({ window })
  const router = createRouter($routes)

  const cannotMatchPage = (
    pathname: string,
    globalContext: GlobalContextType
  ) => {
    const error = new Error(`Unknow path: ${pathname}`)
    const msg = error.stack || error.message
    const element = connect(() => createErrorElement(msg))(globalContext)()
    ReactDOM.render(element, containerElement)
  }

  const listener: Listener = async ({ location }) => {
    const render: Render = async (pageCreator, params) => {
      const location = history.location

      const globalContext: GlobalContextType = {
        location,
        history,
        context: {
          ...context,
          ssr: false,
        },
        params,
      }
      if (pageCreator === null) {
        cannotMatchPage(location.pathname, globalContext)
      } else {
        const page = await pageCreator(globalContext)
        const [view, store] = getViewAndStoreFromPage(page)

        const component = connect(view)(globalContext)
        ReactDOM.render(component(), containerElement)

        store.subscribe(() => {
          ReactDOM.render(component(), containerElement)
        })
      }
    }

    router(location.pathname, render)
  }

  const init: Render = async (pageCreator, params) => {
    const location = history.location
    const globalContext: GlobalContextType = {
      location,
      history,
      context,
      params,
    }
    if (pageCreator === null) {
      cannotMatchPage(location.pathname, globalContext)
    } else {
      const page = await pageCreator(globalContext)
      const [view, store] = getViewAndStoreFromPage(page)

      if (context.ssr) {
        store.__UNSAFE_SET_STATE__(state)
      }

      const component = connect(view)(globalContext)

      if (context.ssr) {
        ReactDOM.hydrate(component(), containerElement)
      } else {
        ReactDOM.render(component(), containerElement)
      }

      store.subscribe(() => {
        ReactDOM.render(component(), containerElement)
      })

      history.listen(listener)
    }
  }

  router(location.pathname, init)
} catch (err) {
  console.error(err)
}

function isArray<T, S>(input: ArrayLike<T> | S): input is ArrayLike<T> {
  return Array.isArray(input)
}

function createNoopStore(): StoreLike<any> {
  return {
    subscribe: (_) => {
      return () => {}
    },
    getState: () => {
      return {}
    },
    __UNSAFE_SET_STATE__: (_) => {
      return {}
    },
  }
}

function getViewAndStoreFromPage(page: Page) {
  return isArray(page) ? page : ([page, createNoopStore()] as const)
}
