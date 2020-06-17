import createPage from './createPage'
import type { Store, Actions } from '../store/index'
import type { Page } from './index'
import type { History } from '../history'
import type { Context } from '../index'

export type PageCreator<
  S extends object,
  AS extends Actions<S>
> = (history: History, context: Context) => [
  React.ComponentType,
  Store<S, AS>
]

export type StateFromPageCreator<PC extends PageCreator<any, any>> = PC extends PageCreator<infer S, any> ? S : never
export type ActionsFromPageCreator<PC extends PageCreator<any, any>> = PC extends PageCreator<any, infer AS> ? AS : never

function usePage<
  Creator extends PageCreator<any, any>,
  S extends Object = StateFromPageCreator<Creator>,
  AS extends Actions<S> = ActionsFromPageCreator<Creator>
>(creator: Creator): Page<S, AS> {
  return (history: History, context: Context) => {
    const [View, store] = creator(history, context)
    return createPage(View, store)(history, context)
  }
}

export default usePage