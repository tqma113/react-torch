import type { History } from 'torch-history'
import type { Context } from '../../index'
import type { StoreLike } from '../store/index'

export type Page<S extends object> = readonly [
  () => JSX.Element,
  StoreLike<S>
]

export type Creater<S extends object> = (
  history: History,
  context: Context
) => Page<S> | Promise<Page<S>>

export type PageCreater<S extends object> = Creater<
  S
> & {
  symbol: Symbol
}

const TORCH_PAGE_SYMBOL = Symbol('TORCH_PAGE')

export type StateFromPageCreator<
  PC extends Creater<any>
> = PC extends Creater<infer S> ? S : never

export function createPage<S extends Object>(
  creater: Creater<S>
): PageCreater<S> {
  return Object.assign(creater, {
    symbol: TORCH_PAGE_SYMBOL,
  })
}

export const isTorchPage = (input: any): input is PageCreater<any> => {
  return typeof input === 'function' && input.symbol === TORCH_PAGE_SYMBOL
}
