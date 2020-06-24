import React from 'react'
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
  return (history: History, context: Context) => {
    const [View, store] = creator(history, context)
    return [
      () =>  <View />,
      store
    ]
  }
}

export default createPage