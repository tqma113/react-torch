import React from 'react'
import { setPageLifeCircle, getLifeCircle } from '../lifecircle'
import type { History } from '../history'
import type { Context } from '../index'
import type { Store, Actions } from '../store/index'
import type { LifeCircle } from '../lifecircle'

export type PageCreatorLoader<S extends object, AS extends Actions<S>> = () =>
  | PageCreator<S, AS>
  | Promise<PageCreator<S, AS>>

export type PageCreator<S extends object, AS extends Actions<S>> = (
  history: History,
  context: Context
) => readonly [() => JSX.Element, Store<S, AS>, LifeCircle]

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
  return (history: History, context: Context) => {
    const symbol = setPageLifeCircle()
    const [View, store] = creator(history, context)
    const lifecircle = getLifeCircle(symbol)

    return [() => <View />, store, lifecircle] as const
  }
}

export type DynamicImportPageCreater = Promise<{
  default: PageCreator<any, any>
}>

export async function dynamic(
  dynamicImportPageCreator: DynamicImportPageCreater
): Promise<PageCreator<any, any>> {
    return (await dynamicImportPageCreator).default
}
