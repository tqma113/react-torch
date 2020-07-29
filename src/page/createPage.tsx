import React from 'react'
import { setPageLifeCircle, getLifeCircle } from '../lifecircle'
import type {  Actions } from '../store/index'
import type { PageCreator } from './index'
import type { History } from '../history'
import type { Context } from '../index'

export type StateFromPageCreator<PC extends PageCreator<any, any>> = PC extends PageCreator<infer S, any> ? S : never
export type ActionsFromPageCreator<PC extends PageCreator<any, any>> = PC extends PageCreator<any, infer AS> ? AS : never

function createPage<
  Creator extends PageCreator<any, any>,
  S extends Object = StateFromPageCreator<Creator>,
  AS extends Actions<S> = ActionsFromPageCreator<Creator>
>(creator: Creator): PageCreator<S, AS> {
  return async (history: History, context: Context) => {
    const symbol = setPageLifeCircle()
    const [View, store] = await creator(history, context)
    const lifecircle = getLifeCircle(symbol)
    
    return [
      () =>  <View />,
      store,
      lifecircle
    ]
  }
}

export default createPage