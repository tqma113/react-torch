import { createNoopStore } from '../store'
import type { History, Location } from 'torch-history'
import type { Params } from 'torch-router'
import type { Context } from '../../index'
import type { StoreLike } from '../store'

export type Page = [() => JSX.Element, StoreLike<any>] | (() => JSX.Element)

export type CreaterProps = {
  location: Location
  history: History
  context: Context
  params: Params
}

export type Creater = (props: CreaterProps) => Page | Promise<Page>

export type PageCreater = Creater & {
  symbol: Symbol
}

const TORCH_PAGE_SYMBOL = Symbol('TORCH_PAGE')

export function createPage(creater: Creater): PageCreater {
  return Object.assign(creater, {
    symbol: TORCH_PAGE_SYMBOL,
  })
}

export const isTorchPage = (input: any): input is PageCreater => {
  return typeof input === 'function' && input.symbol === TORCH_PAGE_SYMBOL
}

export const getViewAndStoreFromPage = (page: Page) => {
  return isArray(page) ? page : ([page, createNoopStore()] as const)
}

function isArray<T, S>(input: ArrayLike<T> | S): input is ArrayLike<T> {
  return Array.isArray(input)
}
