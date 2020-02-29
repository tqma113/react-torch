/**
 * Copy from <https://github.com/ReactTraining/history/tree/ts>
 */

////////////////////////////////////////////////////////////////////////////////
// TYPES
////////////////////////////////////////////////////////////////////////////////

export enum Action {
  POP = 'POP',
  PUSH = 'PUSH',
  REPLACE = 'REPLACE'
}

export type Path = string
export type PathPieces = {
  pathname?: string
  search?: string
  hash?: string
}

export type State = object
export interface Location<S extends State = State> extends PathPieces {
  pathname: string
  search: string
  hash: string
  state?: S
  key?: string
}

export interface Update<S extends State = State> {
  action: Action
  location: Location<S>
}
export interface Listener<S extends State = State> {
  (update: Update<S>): void
}
export type Unlistener = () => void

export interface Transaction<S extends State = State> extends Update {
  retry(): void
}
export interface Blocker<S extends State = State> {
  (tx: Transaction<S>): void
}
export type Unblocker = () => void

export interface History<S extends State = State> {
  action: Action
  location: Location<S>
  createHref(to: Path | PathPieces): string
  push(to: Path | PathPieces, state?: State): void
  replace(to: Path | PathPieces, state?: State): void
  go(n: number): void
  back(): void
  forward(): void
  listen(listener: Listener<S>): Unlistener
  block(blocker: Blocker<S>): Unblocker
}
export interface MemoryHistory<S extends State = State> extends History<S> {
  index: number
}

type HistoryState = {
  usr?: State
  key?: string
  idx?: number
}

////////////////////////////////////////////////////////////////////////////////
// CONSTANTS
////////////////////////////////////////////////////////////////////////////////

const BeforeUnloadEventType = 'beforeunload'
const PopStateEventType = 'popstate'

const readOnly = (obj: any) => obj

function warning(cond: boolean, message: string) {
  if (!cond) {
    // eslint-disable-next-line no-console
    if (typeof console !== 'undefined') console.warn(message)

    // Throw an error so people can use the debugger's "pause on exceptions"
    // function to find the source of warnings.
    try {
      throw new Error(message)
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
}

function noop() {}

////////////////////////////////////////////////////////////////////////////////
// BROWSER
////////////////////////////////////////////////////////////////////////////////

/**
 * Browser history stores the location in regular URLs. This is the
 * standard for most web apps, but it requires some configuration on
 * the server to ensure you serve the same app at multiple URLs.
 */
export default function createBrowserHistory(): History {
  let globalHistory = window.history

  function getIndexAndLocation(): [number, Location] {
    let { pathname, search, hash } = window.location
    let state: HistoryState = globalHistory.state || {}
    return [
      state.idx || 0,
      readOnly({
        pathname,
        search,
        hash,
        state: state.usr || null,
        key: state.key || 'default'
      })
    ]
  }

  let blockedPopTx: Transaction | null = null
  function handlePop(): void {
    if (blockedPopTx) {
      blockers.call(blockedPopTx)
      blockedPopTx = null
    } else {
      let nextAction = Action.POP
      let [nextIndex, nextLocation] = getIndexAndLocation()

      if (blockers.length) {
        if (nextIndex != null) {
          let n = index - nextIndex
          if (n) {
            // Revert the POP
            blockedPopTx = {
              action: nextAction,
              location: nextLocation,
              retry() {
                go(n * -1)
              }
            }

            go(n)
          }
        } else {
          // Trying to POP to a location with no index. We did not create
          // this location, so we can't effectively block the navigation.
          warning(
            false,
            // TODO: Write up a doc that explains our blocking strategy in
            // detail and link to it here so people can understand better
            // what is going on and how to avoid it.
            `You are trying to block a POP navigation to a location that was not ` +
              `created by the history library. The block will fail silently in ` +
              `production, but in general you should do all navigation with the ` +
              `history library (instead of using window.history.pushState directly) ` +
              `to avoid this situation.`
          )
        }
      } else {
        applyTx(nextAction)
      }
    }
  }

  window.addEventListener(PopStateEventType, handlePop)

  let action: Action = Action.POP
  let [index, location] = getIndexAndLocation()
  let blockers = createEvents()
  let listeners = createEvents()

  if (index == null) {
    index = 0
    globalHistory.replaceState({ ...globalHistory.state, idx: index }, '')
  }

  function createHref(to: Path | PathPieces): string {
    return typeof to === 'string' ? to : createPath(to)
  }

  function getNextLocation(to: Path | PathPieces, state?: State): Location {
    return readOnly({
      ...location,
      ...(typeof to === 'string' ? parsePath(to) : to),
      state,
      key: createKey()
    })
  }

  function getHistoryStateAndUrl(
    nextLocation: Location,
    index: number
  ): [HistoryState, string] {
    return [
      {
        usr: nextLocation.state,
        key: nextLocation.key,
        idx: index
      },
      createHref(nextLocation)
    ]
  }

  function allowTx(
    action: Action,
    location: Location,
    retry: () => void
  ): boolean {
    return (
      !blockers.length || (blockers.call({ action, location, retry }), false)
    )
  }

  function applyTx(nextAction: Action): void {
    action = nextAction
    ;[index, location] = getIndexAndLocation()
    listeners.call({ action, location })
  }

  function push(to: Path | PathPieces, state?: State): void {
    let nextAction = Action.PUSH
    let nextLocation = getNextLocation(to, state)
    function retry() {
      push(to, state)
    }

    if (allowTx(nextAction, nextLocation, retry)) {
      let [historyState, url] = getHistoryStateAndUrl(nextLocation, index + 1)

      // TODO: Support forced reloading
      // try...catch because iOS limits us to 100 pushState calls :/
      try {
        globalHistory.pushState(historyState, '', url)
      } catch (error) {
        // They are going to lose state here, but there is no real
        // way to warn them about it since the page will refresh...
        window.location.assign(url)
      }

      applyTx(nextAction)
    }
  }

  function replace(to: Path | PathPieces, state?: State): void {
    let nextAction = Action.REPLACE
    let nextLocation = getNextLocation(to, state)
    function retry() {
      replace(to, state)
    }

    if (allowTx(nextAction, nextLocation, retry)) {
      let [historyState, url] = getHistoryStateAndUrl(nextLocation, index)

      // TODO: Support forced reloading
      globalHistory.replaceState(historyState, '', url)

      applyTx(nextAction)
    }
  }

  function go(n: number): void {
    globalHistory.go(n)
  }

  let history = {
    get action(): Action {
      return action
    },
    get location(): Location {
      return location
    },
    createHref,
    push,
    replace,
    go,
    back(): void {
      go(-1)
    },
    forward(): void {
      go(1)
    },
    listen(listener: Listener): Unlistener {
      return listeners.push(listener)
    },
    block(blocker: Blocker = noop): Unblocker {
      let unblock = blockers.push(blocker)

      if (blockers.length === 1) {
        window.addEventListener(BeforeUnloadEventType, promptBeforeUnload)
      }

      return function() {
        unblock()

        // Remove the beforeunload listener so the document may
        // still be salvageable in the pagehide event.
        // See https://html.spec.whatwg.org/#unloading-documents
        if (!blockers.length) {
          window.removeEventListener(BeforeUnloadEventType, promptBeforeUnload)
        }
      }
    }
  }

  return history
}

function promptBeforeUnload(event: BeforeUnloadEvent) {
  // Cancel the event.
  event.preventDefault()
  // Chrome (and legacy IE) requires returnValue to be set.
  event.returnValue = ''
}

function createEvents() {
  let handlers: ((arg: any) => void)[] = []

  return {
    get length() {
      return handlers.length
    },
    push(fn: (arg: any) => void) {
      handlers.push(fn)
      return function() {
        handlers = handlers.filter(handler => handler !== fn)
      }
    },
    call(arg: any) {
      handlers.forEach(fn => fn && fn(arg))
    }
  }
}

function createKey() {
  return Math.random()
    .toString(36)
    .substr(2, 8)
}

export function createPath({
  pathname = '/',
  search = '',
  hash = ''
}: PathPieces): Path {
  return pathname + search + hash
}

export function parsePath(path: Path): PathPieces {
  let pieces: PathPieces = {}

  if (path) {
    let hashIndex = path.indexOf('#')
    if (hashIndex >= 0) {
      pieces.hash = path.substr(hashIndex)
      path = path.substr(0, hashIndex)
    }

    let searchIndex = path.indexOf('?')
    if (searchIndex >= 0) {
      pieces.search = path.substr(searchIndex)
      path = path.substr(0, searchIndex)
    }

    if (path) {
      pieces.pathname = path
    }
  }

  return pieces
}
