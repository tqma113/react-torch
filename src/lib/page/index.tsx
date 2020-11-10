import { createNoopStore } from '../store'
import type { History, Location } from 'torch-history'
import type { Params } from 'torch-router'
import type { Context } from '../../index'
import type { StoreLike } from '../store'

export type BasePage = {
  Component: () => JSX.Element
  store?: StoreLike<any>
  willCreate?: () => Promise<void>
  willUnmount?: (nextLocation: Location) => Promise<void>
}

export type StandardPage = Required<BasePage>

export type Page = (() => JSX.Element) | BasePage

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

function noop() {
  return Promise.resolve()
}

const noopPage = {
  store: createNoopStore(),
  willCreate: noop,
  willUnmount: noop,
}

export function standardizePage(page: Page): StandardPage {
  if (isFunction(page)) {
    return {
      ...noopPage,
      Component: page,
    }
  } else {
    return {
      ...noopPage,
      ...page,
    }
  }
}

function isFunction<Args, R, S>(
  input: ((args: Args) => R) | S
): input is (args: Args) => R {
  return input && typeof input === 'function'
}
