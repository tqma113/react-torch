import React from 'react'
import { createNoopStore, StoreLike, StoreFactory } from '../store'
import type { Params } from 'torch-router'
import type { History, Location } from 'torch-history'
import type { Context } from '../../index'

export type Page = React.ClassicComponent | React.FunctionComponent

export type PageView = () => JSX.Element

export type InitializeProps<Store> = {
  location: Location
  history: History
  context: Context
  params: Params
  store: Store
}

export type SyncInitializer<Store extends StoreLike<any>> = (
  props: InitializeProps<Store>
) => PageView
export type AsyncInitializer<Store extends StoreLike<any>> = (
  props: InitializeProps<Store>
) => Promise<PageView>

export type PageInitializer<Store extends StoreLike<any>> =
  | SyncInitializer<Store>
  | AsyncInitializer<Store>

export type PageCreater<State, Store extends StoreLike<any>> = {
  initializer: PageInitializer<Store>
  createStore: StoreFactory<Store>
  initialState: State | undefined
  symbol: Symbol
}

const TORCH_PAGE_SYMBOL = Symbol('TORCH_PAGE')
export function createPage<State, Store extends StoreLike<State>>(
  initializer: PageInitializer<Store>,
  createStore: StoreFactory<Store> = createNoopStore as any,
  initialState: State | undefined = undefined
): PageCreater<State, Store> {
  return {
    initializer,
    createStore,
    initialState,
    symbol: TORCH_PAGE_SYMBOL,
  }
}

export const isTorchPage = (input: any): input is PageCreater<any, any> => {
  return typeof input === 'function' && input.symbol === TORCH_PAGE_SYMBOL
}

export const noopPage: Page = () => <></>
