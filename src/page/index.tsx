export { default as createPage } from './createPage'
export { default as usePage } from './usePage'

import type { Store, Actions } from '../store/index'

export type Page<
  S extends object = {},
  AS extends Actions<S> = {}
> = [
  React.ComponentType<{ store: Store<S, AS> }>,
  Store<S, AS>
]

export type PageWithoutStore = [
  React.ComponentType<{}>,
  null
]
