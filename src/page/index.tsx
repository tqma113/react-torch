export { default as createPage } from './createPage'

import type { Context } from '../index'
import type { History } from '../history'
import type { Store, Actions } from '../store/index'

export type PageCreator<
  S extends object,
  AS extends Actions<S>
> = (history: History, context: Context) => [
  React.ComponentType,
  Store<S, AS>
]

export type Page<
  S extends object = {},
  AS extends Actions<S> = {}
> = () => [
  React.ComponentType,
  Store<S, AS>
]

export type PageWithoutStore = [
  React.ComponentType,
  null
]
