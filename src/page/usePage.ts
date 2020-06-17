import createPage from './createPage'
import type { Store, Actions } from '../store/index'
import type { Page } from './index'
import type { Location } from '../history'
import type { Context } from '../index'

export type PageCreator<
  S extends object,
  AS extends Actions<S>
> = (location: Location, context: Context) => [
  React.ComponentType,
  Store<S, AS>
]

function usePage<
  S extends object,
  AS extends Actions<S>,
  Creator extends PageCreator<S, AS>
>(creator: Creator): Page<S, AS> {
  return (location: Location, context: Context) => {
    const [View, store] = creator(location, context)
    return createPage(View, store)(location, context)
  }
}

export default usePage