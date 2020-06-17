import React from 'react'
import ReactDOM from "react-dom"
import invariant from 'tiny-invariant'
import createMatcher from './createMatcher'
import createHistory from '../../history/browser'
import type { Key } from 'path-to-regexp'
import type { Context } from '../../index'
import type { Listener } from '../../history'
import type { PageCreator } from '../../page/index'

export type DraftRoute = {
  keys?: Key[]
  regexp?: RegExp
  path: string,
  page: PageCreator<any, any>
}

const DEFAULT_PAGE: PageCreator<{}, {}> = () => [
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
    init() {
      let page = DEFAULT_PAGE
      const location = history.location
      const matches = matcher(location.pathname)

      if (matches === null) {
        throw new Error('Unknow page')
      } else {
        page = matches.page
      }

      const [view, store] = page(history, context)

      if (context.ssr) {
        store.UNSAFE_setState(state)
      }

      const element: React.ReactElement<{}> = React.createElement(view)
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

      store.listen(() => {
        const element: React.ReactElement<{}> = React.createElement(view)
        ReactDOM.render(element, containerElement)
      })
    },
    start() {
      const listener: Listener = ({ location }) => {
        let page = DEFAULT_PAGE
        const matches = matcher(location.pathname)

        if (matches === null) {
          throw new Error('Unknow page')
        } else {
          page = matches.page
        }

        const ctx = {
          ...context,
          ssr: false
        }
        const [view, store] = page(history, ctx)

        const element: React.ReactElement<{}> = React.createElement(view)
        const containerElement = document.querySelector(`#${container}`)

        invariant(
          containerElement !== null,
          `The container: ${container} is not exist`
        )

        ReactDOM.render(element, containerElement)

        store.listen(() => {
          const element: React.ReactElement<{}> = React.createElement(view)
          ReactDOM.render(element, containerElement)
        })
      }

      history.listen(listener)
    }
  }
}