import React from 'react'
import ReactDOM from "react-dom"
import invariant from 'tiny-invariant'
import createMatcher from './createMatcher'
import createHistory from '../../history/browser'
import {
  setPageLifeCircle,
  getLifeCircle
} from '../../lifecircle'
import type { Key } from 'path-to-regexp'
import type { Context } from '../../index'
import type { Listener } from '../../history'
import type { PageCreator, PageCreatorLoader } from '../../page/index'

export type DraftRoute = {
  keys?: Key[]
  regexp?: RegExp
  path: string
  page: PageCreatorLoader<any, any>
}

const DEFAULT_PAGE_CREATOR: PageCreator<{}, {}> = () => [
  () => React.createElement('div', {}, ''),
  { state: {}, actions: {} } as any
]

export default function createRouter(
  routes: DraftRoute[],
  container: string,
  context: Context,
  state: object
) {
  const history = createHistory({ window })
  const matcher = createMatcher(routes)

  return {
    async init() {
      let pageCreator = DEFAULT_PAGE_CREATOR
      const location = history.location
      const matches = matcher(location.pathname)

      if (matches === null) {
        throw new Error('Unknow page')
      } else {
        pageCreator = await loadPageCreator(matches.page())
      }

      const symbol = Symbol('TORCH_PAGE')
      setPageLifeCircle(symbol)
      const [view, store] = pageCreator(history, context)
      const lifecircle = getLifeCircle(symbol)

      if (context.ssr) {
        store.UNSAFE_setState(state)
      }

      if (context.ssr === false) {
        await lifecircle.willCreate()
      }

      const element: React.ReactElement<{}> = React.createElement(view)
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

      store.listen(() => {
        const element: React.ReactElement<{}> = React.createElement(view)
        ReactDOM.render(element, containerElement)
      })
    },
    start() {
      const listener: Listener = async ({ location }) => {
        let pageCreator = DEFAULT_PAGE_CREATOR
        const matches = matcher(location.pathname)

        if (matches === null) {
          throw new Error('Unknow page')
        } else {
          pageCreator = await loadPageCreator(matches.page())
        }

        const ctx = {
          ...context,
          ssr: false
        }
        const symbol = Symbol('TORCH_PAGE')
        setPageLifeCircle(symbol)
        const [view, store] = pageCreator(history, ctx)
        const lifecircle = getLifeCircle(symbol)

        await lifecircle.willCreate()

        const element: React.ReactElement<{}> = React.createElement(view)
        const containerElement = document.querySelector(`#${container}`)

        invariant(
          containerElement !== null,
          `The container: ${container} is not exist`
        )
      
        await lifecircle.willMount()

        ReactDOM.render(element, containerElement)

        await lifecircle.didMount()

        store.listen(() => {
          const element: React.ReactElement<{}> = React.createElement(view)
          ReactDOM.render(element, containerElement)
        })
      }

      history.listen(listener)
    }
  }
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