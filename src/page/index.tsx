import React from 'react'
import type { Store, Actions, Currings } from '../store/index'

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

function createPage(
  View: React.ComponentType<{}>,
): PageWithoutStore

function createPage<
  S extends object = {},
  AS extends Actions<S> = {}
>(
  View: React.ComponentType<{
    state: S,
    actions: Currings<S, AS>
  }>,
  store: Store<S, AS>
): Page<S, AS>

function createPage<
  S extends object = {},
  AS extends Actions<S> = {}
>(
  View: React.ComponentType<{
    state: S,
    actions: Currings<S, AS>
  }> | React.ComponentType<{}>,
  store?: Store<S, AS>
): Page<S, AS> | PageWithoutStore {
  if (!store) {
    return [
      // @ts-ignore
      () =>  <View />,
      null
    ] as PageWithoutStore
  } else {
    return [
      ({ store }: { store: Store<S, AS> }) =>  <View state={store.state} actions={store.actions} />,
      store
    ]
  }
}

export {
  createPage
}
