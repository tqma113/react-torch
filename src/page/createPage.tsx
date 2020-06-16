import React from 'react'
import type { Store, Actions, Currings } from '../store/index'
import type { Page, PageWithoutStore } from './index'

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

export default createPage
