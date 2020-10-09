import React from 'react'
import { setLifeCircle, getLifeCircle } from '../lifecycle'
import type { History } from 'torch-history'
import type { Context } from '../../index'
import type { Store, Actions } from '../store/index'
import type { LifeCircle } from '../lifecycle'

export type PageCreator<S extends object, AS extends Actions<S>> = ((
  history: History,
  context: Context
) => readonly [() => JSX.Element, Store<S, AS>, LifeCircle]) & {
  symbol: Symbol
}

const TORCH_PAGE_SYMBOL = Symbol('TORCH_PAGE')

export type Creater<S extends object, AS extends Actions<S>> = (
  history: History,
  context: Context
) => readonly [() => JSX.Element, Store<S, AS>]

export type PageWithoutStore = [() => JSX.Element, null]

export type StateFromPageCreator<
  PC extends Creater<any, any>
> = PC extends Creater<infer S, any> ? S : never
export type ActionsFromPageCreator<
  PC extends Creater<any, any>
> = PC extends Creater<any, infer AS> ? AS : never

export function createPage<
  C extends Creater<any, any>,
  S extends Object = StateFromPageCreator<C>,
  AS extends Actions<S> = ActionsFromPageCreator<C>
>(creator: C): PageCreator<S, AS> {
  return Object.assign(
    (history: History, context: Context) => {
      const symbol = setLifeCircle()
      const [View, store] = creator(history, context)
      const lifecycle = getLifeCircle(symbol)

      return [() => <View />, store, lifecycle] as const
    },
    {
      symbol: TORCH_PAGE_SYMBOL,
    }
  )
}

export const isTorchPage = (input: any): input is PageCreator<any, any> => {
  return typeof input === 'function' && input.symbol === TORCH_PAGE_SYMBOL
}
