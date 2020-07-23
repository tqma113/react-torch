import 'core-js/stable'
import 'regenerator-runtime/runtime'

import React from 'react'
import ReactDOM from "react-dom"
import ReactDOMServer from "react-dom/server"
import invariant from 'tiny-invariant'
import createRouter from '../router'
import createHistory from '../history/browser'
import {
  setPageLifeCircle,
  getLifeCircle
} from '../lifecircle'
import { connect } from '../context'
import { createErrorElement } from '../error'
// @ts-ignore
import $routes from "@routes"
import type { Listener } from '../history'
import type { TORCH_DATA } from '../index'
import type { GlobalContextType } from '../context'
import type { PageCreator, PageCreatorLoader } from '../page/index'

declare global {
  interface Window {
    __TORCH_DATA__: TORCH_DATA
    __DEV__: boolean
  }
}

const dataScript = document.getElementById('__TORCH_DATA__') as HTMLScriptElement | null
if (dataScript) {
  const jsonStr = dataScript.textContent
  if (jsonStr) {
    const history = createHistory({ window })
    const location = history.location
    
    try {
      const data: TORCH_DATA = JSON.parse(jsonStr)
      const { context, container, state } = data

      window.__TORCH_DATA__ = data

      const router = createRouter($routes)


      const listener: Listener = async ({ location }) => {
        const render = (pageCreatorLoader: PageCreatorLoader<any, any> | null) => {
          if (pageCreatorLoader === null) {
            const globalContext = {
              location,
              history,
              context
            }
            const error = new Error(`Unknow path: ${location.pathname}`)
            const msg = JSON.stringify(error)
            const element = connect(() => createErrorElement(msg))(globalContext as any)
            const containerElement = document.querySelector(`#${container}`)
            ReactDOM.render(element, containerElement)
          } else {
            loadPageCreator(pageCreatorLoader()).then(async (pageCreator) => {
              const ctx = {
                ...context,
                ssr: false
              }
              const symbol = Symbol('TORCH_PAGE')
              setPageLifeCircle(symbol)
              const [view, store] = await pageCreator(history, ctx)
              const lifecircle = getLifeCircle(symbol)
        
              await lifecircle.willCreate()
        
              const globalContext: GlobalContextType = {
                location,
                history,
                store,
                context
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
                  context
                }
                const element = connect(view)(globalContext)
                ReactDOM.render(element, containerElement)
              })
            })
          }
        }
  
        router(render, location.pathname)
      }
      
      const init = (pageCreatorLoader: PageCreatorLoader<any, any> | null) => {
        if (pageCreatorLoader === null) {
          const globalContext = {
            location,
            history,
            context
          }
          const error = new Error(`Unknow path: ${location.pathname}`)
          const msg = JSON.stringify(error)
          const element = connect(() => createErrorElement(msg))(globalContext as any)
          const containerElement = document.querySelector(`#${container}`)
          ReactDOM.render(element, containerElement)
        } else {
          loadPageCreator(pageCreatorLoader()).then(async (pageCreator) => {
            const symbol = Symbol('TORCH_PAGE')
            setPageLifeCircle(symbol)
            const [view, store] = await pageCreator(history, context)
            const lifecircle = getLifeCircle(symbol)

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
              context
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
                context
              }
              const element = connect(view)(globalContext)
              ReactDOM.render(element, containerElement)
            })
          }).then(() => {
            history.listen(listener)
          })
        }
      }

      router(init, location.pathname)
    } catch (err) {
      console.error(err)
    }
  } else {
  }
} else {
  console.error('Render failed. Can\' find __TORCH_DATA__ script element!')
}

async function loadPageCreator(
  draftPageCreator: PageCreator<any, any> | Promise<PageCreator<any, any>>
):  Promise<PageCreator<any, any>> {
  if (isPromise(draftPageCreator)) {
    // @ts-ignore
    return (await draftPageCreator).default
  } else {
    return draftPageCreator
  }
}

export function isPromise(obj: any): obj is Promise<any> {
  return obj && obj.then && typeof obj.then === 'function'
}