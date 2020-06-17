export { default as createPage } from './createPage'
export { default as usePage } from './usePage'

import type { Context } from '../index'
import type { History } from '../history'
import type { Store, Actions } from '../store/index'

export type Page<
  S extends object = {},
  AS extends Actions<S> = {}
> = (history: History, context: Context) => [
  React.ComponentType<{ store: Store<S, AS> }>,
  Store<S, AS>
]

export type PageWithoutStore = [
  React.ComponentType<{}>,
  null
]
