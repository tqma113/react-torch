import React from 'react'
import { Store, Actions, Currings } from '../store'

export type Page<
  S extends object = {},
  AS extends Actions<S> = {}
> = [
  React.ComponentType<{ store: Store<S, AS> }>,
  Store<S, AS>
]

export function createPage<
  S extends object = {},
  AS extends Actions<S> = {}
>(
  View: React.ComponentType<{
    state: S,
    actions: Currings<S, AS>
  }>,
  store: Store<S, AS>
): Page<S, AS> {
  return [
    ({ store }) =>  <View state={store.state} actions={store.actions} />,
    store
  ]
}