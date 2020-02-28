import React from 'react'
import { Store, Actions, Currings } from '../store'

export function createPage<
  S extends object = {},
  AS extends Actions<S> = {}
>(
  View: React.ComponentType<{
    state: S,
    actions: Currings<S, AS>
  }>,
  store: Store<S, AS>
): React.ComponentType {
  return () => <View state={store.state} actions={store.actions} />
}