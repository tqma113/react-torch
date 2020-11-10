import { createNoopStore } from '../store'
import type { History, Location } from 'torch-history'
import type { Params } from 'torch-router'
import type { Context } from '../../index'
import type { StoreLike } from '../store'

export type PageLifeCycle = {
  willCreate: () => Promise<void>
  willUnmount: (nextLocation: Location) => Promise<void>
}

export type Page =
  | (() => JSX.Element)
  | {
    Component: (() => JSX.Element)
    store?: StoreLike<any>
    willCreate?: () => Promise<void>
    willUnmount?: (nextLocation: Location) => Promise<void>
  }

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


function noop() {}

const noopPage = {
  store: createNoopStore(),
  willCreate: noop,
  willUnmount: noop
}

export function getViewAndStoreFromPage(page: Page) {
  if (isFunction(page)) {
    return {
      Component: page,
      ...noopPage
    }
  } else {
    return {
      ...noopPage,
      ...page
    }
  }
}

function isFunction<Args, R, S>(input: ((args: Args) => R) | S): input is ((args: Args) => R) {
  return input && Object.toString.call(input) === '[object Function]'
}
