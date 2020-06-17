import pathToRegexp from 'path-to-regexp'
import type { Key, Path } from 'path-to-regexp'
import type { DraftRoute } from './index'
import type { PageCreator } from '../../page/index'

export interface Route {
  keys: Key[]
  regexp: RegExp
  path: Path
  page: PageCreator<any, any>
}

export interface Params {
  [propName: string]: unknown
}

export interface Matches {
  path: Path
  params: Params
  page: PageCreator<any, any>
}

export interface Matcher {
  (pathname: string): Matches | null
}

export default function createMatcher(routes: DraftRoute[]) {
  const finalRoutes: Route[] = routes.map(createRoute)
  const routeLength: number = finalRoutes.length
  const matcher: Matcher = (pathname) => {
    let finalPathname = cleanPath(pathname)
    for (let i = 0; i < routeLength; i++) {
      let route: Route = finalRoutes[i]
      let strMatches: RegExpExecArray | null = route.regexp.exec(finalPathname)
      if (!strMatches) {
        continue
      }
      let params: Params = getParams(strMatches, route.keys)
      let page = route.page

      return {
        path: route.path,
        params,
        page
      }
    }
    return null
  }

  return matcher
}

function createRoute(route: DraftRoute): Route {
  let finalRoute: DraftRoute = Object.assign({}, route)
  finalRoute.keys = []
  let keys: Key[] = finalRoute.keys
  let regexp = pathToRegexp(finalRoute.path, keys)
  let intactRoute: Route = Object.assign({ keys, regexp }, finalRoute)
  return intactRoute
}

function getParams(
  matches: RegExpExecArray,
  keys: Key[]
): Params {
  let params: Params = {}
  for (let i = 1, len = matches.length; i < len; i++) {
    let key = keys[i - 1]
    if (key) {
      if (typeof matches[i] === 'string') {
        params[key.name] = decodeURIComponent(matches[i])
      } else {
        params[key.name] = matches[i]
      }
    }
  }
  return params
}

function cleanPath(path: string): string {
  return path.replace(/\/\//g, '/')
}
