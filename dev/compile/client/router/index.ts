import React from 'react'
import ReactDOM from "react-dom"
import { Key } from 'path-to-regexp'
import invariant from 'tiny-invariant'
import createMatcher from './createMatcher'
import createHistory, { Listener } from './createHistory'
import { Page } from '../../../../page'

export type DraftRoute = {
  keys?: Key[]
  regexp?: RegExp
  path: string,
  page: Page<any, any>
}

const DEFAULT_PAGE: Page<{}, {}> = [
  () => React.createElement('div', {}, ''),
  { state: {}, actions: {} } as any
]
const NOT_MATCH: Page<{}, {}> = [
  () => React.createElement('div', {}, 'not match'),
  {} as any
]

export default function createRouter(
  routes: DraftRoute[],
  container: string,
  ssr: boolean
) {
  const history = createHistory()
  const matcher = createMatcher(routes)
  

  return {
    start() {
      const listener: Listener = ({ location }) => {
        let page = DEFAULT_PAGE
        const matches = matcher(location.pathname)

        if (matches === null) {
          page = NOT_MATCH
        } else {
          page = matches.page
        }

        const [view, store] = page
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