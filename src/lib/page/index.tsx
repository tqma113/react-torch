import type { History } from 'torch-history'
import type { Context } from '../../index'
import type { Store, Actions } from '../store/index'

export type Page<S extends object, AS extends Actions<S>> = readonly [
  () => JSX.Element,
  Store<S, AS>
]

export type Creater<S extends object, AS extends Actions<S>> = (
  history: History,
  context: Context
) => Page<S, AS> | Promise<Page<S, AS>>

export type PageCreater<S extends object, AS extends Actions<S>> = Creater<
  S,
  AS
> & {
  symbol: Symbol
}

const TORCH_PAGE_SYMBOL = Symbol('TORCH_PAGE')

export type StateFromPageCreator<
  PC extends Creater<any, any>
> = PC extends Creater<infer S, any> ? S : never
export type ActionsFromPageCreator<
  PC extends Creater<any, any>
> = PC extends Creater<any, infer AS> ? AS : never

export function createPage<S extends Object, AS extends Actions<S>>(
  creater: Creater<S, AS>
): PageCreater<S, AS> {
  return Object.assign(creater, {
    symbol: TORCH_PAGE_SYMBOL,
  })
}

export const isTorchPage = (input: any): input is PageCreater<any, any> => {
  return typeof input === 'function' && input.symbol === TORCH_PAGE_SYMBOL
}
