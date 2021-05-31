import React from 'react'
import ReactDOM from 'react-dom'
import { createBrowserHistory } from 'torch-history'
import {
  connectContext,
  createRouter,
  connectModels,
  preloadModels,
} from '../../client'
import { createErrorElement } from '../error'
import { runCreater, setupPage } from '../hook'
import $routes from '@routes'
import type { Params } from 'torch-router'
import type { Listener, Location } from 'torch-history'
import type { TorchData, Context } from '../../index'
import type { GlobalContextType, PageModule } from '../../client'

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

const stateList: any[] = window.__MODEL_STATE_LIST__

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
  const element = React.createElement(
    connectContext(connectModels(() => createErrorElement(msg)))(globalContext)
  )
  ReactDOM.render(element, containerElement)
}

const destory = async (location: Location) => {
  await hook.beforeDestory(location)
  hook.unsubscribe()
  await hook.destoryed(location)
}

const render = async (
  module: PageModule | null,
  params: Params,
  location: Location,
  context: Context
) => {
  if (module === null) {
    cannotMatchPage(location.pathname, {
      location,
      context,
      params,
      history,
      store: {} as any,
    })
  } else {
    const {
      pageCreater: { initializer, createStore, initialState },
    } = module
    let store = createStore(initialState as any)
    const globalContext: GlobalContextType = {
      location,
      history,
      context,
      params,
      store,
    }
    const component = await runCreater(() => initializer(globalContext))

    if (context.ssr) {
      store = createStore(state)
      await preloadModels(stateList)
    } else {
      await Promise.all(setupPage())
      await preloadModels()
    }

    const element = React.createElement(
      connectContext(connectModels(component))(globalContext)
    )
    if (context.ssr) {
      ReactDOM.hydrate(element, containerElement)
    } else {
      ReactDOM.render(element, containerElement)
    }

    hook.unsubscribe = store.subscribe(() => {
      const element = React.createElement(
        connectContext(connectModels(component))(globalContext)
      )
      ReactDOM.render(element, containerElement)
    })
  }
}

const listener: Listener = async ({ location }) => {
  await destory(location)

  const { module, params } = await router(location.pathname)
  const ctx = {
    ...context,
    ssr: false,
  }
  render(module, params, location, ctx)
}

history.listen(listener)

router(location.pathname).then(({ module, params }) => {
  const location = history.location
  render(module, params, location, context)
})

function noop() {
  return Promise.resolve()
}
