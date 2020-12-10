import ReactDOM from 'react-dom'
import { createBrowserHistory } from 'torch-history'
import { connect, createRouter } from '../../client'
import { createErrorElement } from '../error'
import $routes from '@routes'
import type { Listener, Location } from 'torch-history'
import type { TorchData } from '../../index'
import type {
  GlobalContextType,
  StoreLike,
  Page,
  PageCreater,
  StandardPage,
} from '../../client'

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

  let hook: {
    beforeDestory: (nextLocation: Location) => Promise<void> | void
    destoryed: (nextLocation: Location) => Promise<void> | void
    unsubscribe: () => void
  } = {
    beforeDestory: noop,
    destoryed: noop,
    unsubscribe: noop,
  }

  const cannotMatchPage = (
    pathname: string,
    globalContext: GlobalContextType
  ) => {
    const error = new Error(`Unknow path: ${pathname}`)
    const msg = error.stack || error.message
    const element = connect(() => createErrorElement(msg))(globalContext)
    ReactDOM.render(element, containerElement)
  }

  const destory = async (location: Location) => {
    await hook.beforeDestory(location)
    hook.unsubscribe()
    await hook.destoryed(location)
  }

  const render = async (
    pageCreator: PageCreater | null,
    globalContext: GlobalContextType
  ) => {
    const { location, context } = globalContext

    if (pageCreator === null) {
      cannotMatchPage(location.pathname, globalContext)
    } else {
      const page = await pageCreator(globalContext)
      const {
        store,
        beforeCreate,
        create,
        created,
        beforeDestory,
        destroyed,
      } = standardizePage(page)

      hook.beforeDestory = beforeDestory
      hook.destoryed = destroyed

      if (context.ssr) {
        store.__UNSAFE_SET_STATE__(state)
      } else {
        await beforeCreate()
      }

      const component = await create()
      await created()

      const element = connect(component)(globalContext)

      if (context.ssr) {
        ReactDOM.hydrate(element, containerElement)
      } else {
        ReactDOM.render(element, containerElement)
      }

      hook.unsubscribe = store.subscribe(() => {
        ReactDOM.render(element, containerElement)
      })
    }
  }

  const listener: Listener = async ({ location }) => {
    await destory(location)

    router(location.pathname, async (pageCreator, params) => {
      const globalContext: GlobalContextType = {
        location,
        history,
        context: {
          ...context,
          ssr: false,
        },
        params,
      }

      await render(pageCreator, globalContext)
    })
  }

  router(location.pathname, async (pageCreator, params) => {
    const location = history.location
    const globalContext: GlobalContextType = {
      location,
      history,
      context,
      params,
    }

    await render(pageCreator, globalContext)

    history.listen(listener)
  })
} catch (err) {
  console.error(err)
}

function isFunction<Args, R, S>(
  input: ((args: Args) => R) | S
): input is (args: Args) => R {
  return input && typeof input === 'function'
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

function noop() {
  return Promise.resolve()
}

const noopPage = {
  store: createNoopStore(),
  beforeCreate: () => {},
  created: () => {},
  beforeDestory: () => {},
  destroyed: () => {},
}

function standardizePage(page: Page): StandardPage {
  if (isFunction(page)) {
    return {
      ...noopPage,
      create: async () => page,
    }
  } else {
    return {
      ...noopPage,
      ...page,
    }
  }
}
