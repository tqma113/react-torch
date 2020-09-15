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
import type { PageCreator, PageCreatorLoader } from '../page'

declare global {
  interface Window {
    __TORCH_DATA__: TorchData
    __DEV__: boolean
  }
}

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
        const render = (
          pageCreatorLoader: PageCreatorLoader<any, any> | null
        ) => {
          if (pageCreatorLoader === null) {
            const globalContext = {
              location,
              history,
              context,
            }
            const error = new Error(`Unknow path: ${location.pathname}`)
            const msg = JSON.stringify(error)
            const element = connect(() => createErrorElement(msg))(
              globalContext as any
            )
            const containerElement = document.querySelector(`#${container}`)
            ReactDOM.render(element, containerElement)
          } else {
            loadPageCreator(pageCreatorLoader()).then(async (pageCreator) => {
              const ctx = {
                ...context,
                ssr: false,
              }
              const [view, store, lifecircle] = pageCreator(history, ctx)

              await lifecircle.willCreate()

              const globalContext: GlobalContextType = {
                location,
                history,
                store,
                context: ctx,
              }
              const element = connect(view)(globalContext)
              const containerElement = document.querySelector(`#${container}`)

              invariant(
                containerElement !== null,
                `The container: ${container} is not exist`
              )

              await lifecircle.willMount()

              ReactDOM.render(element, containerElement)

              await lifecircle.didMount()

              store.listen(() => {
                const globalContext: GlobalContextType = {
                  location,
                  history,
                  store,
                  context: ctx,
                }
                const element = connect(view)(globalContext)
                ReactDOM.render(element, containerElement)
              })
            })
          }
        }

        router(location.pathname, render)
      }

      const init = (pageCreatorLoader: PageCreatorLoader<any, any> | null) => {
        if (pageCreatorLoader === null) {
          const globalContext = {
            location,
            history,
            context,
          }
          const error = new Error(`Unknow path: ${location.pathname}`)
          const msg = JSON.stringify(error)
          const element = connect(() => createErrorElement(msg))(
            globalContext as any
          )
          const containerElement = document.querySelector(`#${container}`)
          ReactDOM.render(element, containerElement)
        } else {
          loadPageCreator(pageCreatorLoader())
            .then(async (pageCreator) => {
              const [view, store, lifecircle] = pageCreator(history, context)

              if (context.ssr) {
                store.UNSAFE_setState(state)
              }

              if (!context.ssr) {
                await lifecircle.willCreate()
              }

              const globalContext: GlobalContextType = {
                location,
                history,
                store,
                context,
              }
              const element = connect(view)(globalContext)
              const containerElement = document.querySelector(`#${container}`)

              invariant(
                containerElement !== null,
                `The container: ${container} is not exist`
              )

              await lifecircle.willMount()

              if (context.ssr) {
                ReactDOM.hydrate(element, containerElement)
              } else {
                ReactDOM.render(element, containerElement)
              }

              await lifecircle.didMount()

              store.listen((data) => {
                const globalContext: GlobalContextType = {
                  location,
                  history,
                  store,
                  context,
                }
                const element = connect(view)(globalContext)
                ReactDOM.render(element, containerElement)
              })
            })
            .then(() => {
              history.listen(listener)
            })
        }
      }

      router(location.pathname, init)
    } catch (err) {
      console.error(err)
    }
  } else {
  }
} else {
  console.error("Render failed. Can' find __TORCH_DATA__ script element!")
}

async function loadPageCreator(
  draftPageCreator: PageCreator<any, any> | Promise<PageCreator<any, any>>
): Promise<PageCreator<any, any>> {
  if (isPromise(draftPageCreator)) {
    return await draftPageCreator
  } else {
    return draftPageCreator
  }
}

export function isPromise(obj: any): obj is Promise<any> {
  return obj && obj.then && typeof obj.then === 'function'
}
