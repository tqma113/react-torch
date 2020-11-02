import ReactDOM from 'react-dom'
import invariant from 'tiny-invariant'
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

const dataScript = document.getElementById(
  '__TORCH_DATA__'
) as HTMLScriptElement | null
if (dataScript) {
  const jsonStr = dataScript.textContent
  if (jsonStr) {
    const history = createBrowserHistory({ window })
    const location = history.location

    try {
      const data: TorchData = JSON.parse(jsonStr)
      const { context, container, state } = data

      window.__TORCH_DATA__ = data

      const router = createRouter($routes)

      const listener: Listener = async ({ location }) => {
        const render: Render = async (pageCreator, params) => {
          if (pageCreator === null) {
            const globalContext = {
              location,
              history,
              context,
            }
            const error = new Error(`Unknow path: ${location.pathname}`)
            const msg = JSON.stringify(error)
            const element = connect(() => createErrorElement(msg))(
              (globalContext as unknown) as GlobalContextType
            )
            const containerElement = document.querySelector(`#${container}`)
            ReactDOM.render(element, containerElement)
          } else {
            if (isPromise(pageCreator)) {
              pageCreator = await pageCreator
            }
            const ctx = {
              ...context,
              ssr: false,
            }
            const page = await pageCreator({
              location,
              history,
              context: ctx,
              params,
            })
            const [view, store] = getViewAndStoreFromPage(page)

            const globalContext: GlobalContextType = {
              location,
              history,
              context: ctx,
              params,
            }
            const element = connect(view)(globalContext)
            const containerElement = document.querySelector(`#${container}`)

            invariant(
              containerElement !== null,
              `The container: ${container} is not exist`
            )

            ReactDOM.render(element, containerElement)

            store.subscribe(() => {
              const globalContext: GlobalContextType = {
                location,
                history,
                context: ctx,
                params,
              }
              const element = connect(view)(globalContext)
              ReactDOM.render(element, containerElement)
            })
          }
        }

        router(location.pathname, render)
      }

      const init: Render = async (pageCreator, params) => {
        if (pageCreator === null) {
          const globalContext = {
            location,
            history,
            context,
          }
          const error = new Error(`Unknow path: ${location.pathname}`)
          const msg = JSON.stringify(error)
          const element = connect(() => createErrorElement(msg))(
            (globalContext as unknown) as GlobalContextType
          )
          const containerElement = document.querySelector(`#${container}`)
          ReactDOM.render(element, containerElement)
        } else {
          if (isPromise(pageCreator)) {
            pageCreator = await pageCreator
          }
          const page = await pageCreator({ location, history, context, params })
          const [view, store] = getViewAndStoreFromPage(page)

          if (context.ssr) {
            store.__UNSAFE_SET_STATE__(state)
          }

          const globalContext: GlobalContextType = {
            location,
            history,
            context,
            params,
          }
          const element = connect(view)(globalContext)
          const containerElement = document.querySelector(`#${container}`)

          invariant(
            containerElement !== null,
            `The container: ${container} is not exist`
          )

          if (context.ssr) {
            ReactDOM.hydrate(element, containerElement)
          } else {
            ReactDOM.render(element, containerElement)
          }

          store.subscribe(() => {
            const globalContext: GlobalContextType = {
              location,
              history,
              context,
              params,
            }
            const element = connect(view)(globalContext)
            ReactDOM.render(element, containerElement)
          })

          history.listen(listener)
        }
      }

      router(location.pathname, init)
    } catch (err) {
      console.error(err)
    }
  } else {
    console.error('SSR failed.')
  }
} else {
  console.error("SSR failed. Can' find __TORCH_DATA__ script element!")
}

function isPromise<T, S>(obj: PromiseLike<T> | S): obj is PromiseLike<T> {
  // @ts-ignore
  return obj && obj.then && typeof obj.then === 'function'
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
    __UNSAFE_SET_STATE__: (_) => {},
  }
}

function getViewAndStoreFromPage(page: Page) {
  return isArray(page) ? page : ([page, createNoopStore()] as const)
}
