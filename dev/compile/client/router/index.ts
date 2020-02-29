import React from 'react'
import ReactDOM from "react-dom"
import { Key } from 'path-to-regexp'
import invariant from 'tiny-invariant'
import createMatcher from './createMatcher'
import createHistory, { Listener } from './createHistory'

export type DraftRoute = {
  keys?: Key[]
  regexp?: RegExp
  path: string,
  page: () => Promise<React.ComponentType>
}

const DEFAULT_VIEW = () => React.createElement('div', {}, '')
const NOT_MATCH = () => React.createElement('div', {}, 'not match')

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
        let page = DEFAULT_VIEW
        const matches = matcher(location.pathname)

        if (matches === null) {
          page = NOT_MATCH
        } else {
          page = matches.page
        }

        const element: React.ReactElement<{}> = React.createElement(page, {})
        const containerElement = document.querySelector(`#${container}`)

        invariant(
          containerElement !== null,
          `The container: ${container} is not exist`
        )

        if (ssr) {
          ReactDOM.hydrate(element, containerElement)
        } else {
          ReactDOM.hydrate(element, containerElement)
        }
      }
      history.listen(listener)
    }
  }
}