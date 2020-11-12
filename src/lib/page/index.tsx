import { createNoopStore } from '../store'

import type { Params } from 'torch-router'
import type { History, Location } from 'torch-history'
import type { Context } from '../../index'
import type { StoreLike } from '../store'

export type BasePage = {
  store?: StoreLike<any>

  beforeCreate?: () => Promise<void> | void
  create: () => Promise<PageView> | PageView
  created?: () => Promise<void> | void
  beforeDestory?: (nextLocation: Location) => Promise<void> | void
  destroyed?: (nextLocation: Location) => Promise<void> | void
}

export type PageView = () => JSX.Element

export type StandardPage = Required<BasePage>

export type Page = PageView | BasePage

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

const noopPage = {
  store: createNoopStore(),
  beforeCreate: () => {},
  created: () => {},
  beforeDestory: () => {},
  destroyed: () => {},
}

export function standardizePage(page: Page): StandardPage {
  if (isFunction(page)) {
    return {
      ...noopPage,
      create: async () => page,
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
