import React from 'react'
import type { Store, Actions } from '../store/index'
import type { Page, PageWithoutStore } from './index'

function createPage(
  View: React.ComponentType<{}>,
): PageWithoutStore

function createPage<
  S extends object = {},
  AS extends Actions<S> = {}
>(
  View: React.ComponentType,
  store: Store<S, AS>
): Page<S, AS>

function createPage<
  S extends object = {},
  AS extends Actions<S> = {}
>(
  View: React.ComponentType,
  store?: Store<S, AS>
): Page<S, AS> | PageWithoutStore {
  if (!store) {
    return [
      // @ts-ignore
      () =>  <View />,
      null
    ] as PageWithoutStore
  } else {
    return () => [
      () =>  <View />,
      store
    ]
  }
}

export default createPage
