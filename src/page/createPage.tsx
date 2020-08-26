import React from 'react'
import { setPageLifeCircle, getLifeCircle } from '../lifecircle'
import type { Actions } from '../store/index'
import type { PageCreator, Creater } from './index'
import type { History } from '../history'
import type { Context } from '../index'

export type StateFromPageCreator<
  PC extends Creater<any, any>
> = PC extends Creater<infer S, any> ? S : never
export type ActionsFromPageCreator<
  PC extends Creater<any, any>
> = PC extends Creater<any, infer AS> ? AS : never

function createPage<
  C extends Creater<any, any>,
  S extends Object = StateFromPageCreator<C>,
  AS extends Actions<S> = ActionsFromPageCreator<C>
>(creator: C): PageCreator<S, AS> {
  return async (history: History, context: Context) => {
    const symbol = setPageLifeCircle()
    const [View, store] = await creator(history, context)
    const lifecircle = getLifeCircle(symbol)

    return [() => <View />, store, lifecircle]
  }
}

export default createPage
