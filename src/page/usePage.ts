import createPage from './createPage'
import type { Store, Actions, Currings } from '../store/index'
import type { Page } from './index'

export type PageCreator<
  S extends object = {},
  AS extends Actions<S> = {}
> = () => [
  React.ComponentType<{
    state: S,
    actions: Currings<S, AS>
  }>,
  Store<S, AS>
]

function usePage<
  S extends object = {},
  AS extends Actions<S> = {}
>(creator: PageCreator<S, AS>): Page<S, AS> {
  const [View, store] = creator()
  return createPage(View, store)
}

export default usePage