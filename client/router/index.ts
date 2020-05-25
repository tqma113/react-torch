import React from 'react'
import ReactDOM from "react-dom"
import invariant from 'tiny-invariant'
import createMatcher from './createMatcher'
import createHistory from './createHistory'
import type { Key } from 'path-to-regexp'
import type { Listener } from './createHistory'
import type { Page } from '../../page/index'

export type DraftRoute = {
  keys?: Key[]
  regexp?: RegExp
  path: string,
  page: Page
}

const DEFAULT_PAGE: Page<{}, {}> = [
  () => React.createElement('div', {}, ''),
  { state: {}, actions: {} } as any
]

export default function createRouter(
  routes: DraftRoute[],
  container: string,
  ssr: boolean,
  state: object
) {
  const history = createHistory()
  const matcher = createMatcher(routes)

  return {
    start() {
      const listener: Listener = ({ location }) => {
        let page = DEFAULT_PAGE
        const matches = matcher(location.pathname)

        if (matches === null) {
          throw new Error('Unknow page')
        } else {
          page = matches.page
        }

        const [view, store] = page

        if (ssr) {
          store.UNSAFE_setState(state)
        }

        const element: React.ReactElement<{}> = React.createElement(view, { store })
        const containerElement = document.querySelector(`#${container}`)

        invariant(
          containerElement !== null,
          `The container: ${container} is not exist`
        )

        if (ssr) {
          ReactDOM.hydrate(element, containerElement)
        } else {
          ReactDOM.render(element, containerElement)
        }

        store.listen(() => {
          const element: React.ReactElement<{}> = React.createElement(view, { store })
          ReactDOM.render(element, containerElement)
        })
      }
      history.listen(listener)
    }
  }
}