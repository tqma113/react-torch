import pathToRegexp from "path-to-regexp"

export interface Route {
  keys: pathToRegexp.Key[]
  regexp: RegExp
  path: pathToRegexp.Path
}

export interface Params {
  [propName: string]: any
}

export interface Matches {
  path: pathToRegexp.Path
  params: Params
}

export interface Matcher {
  (pathname: string): Matches | false
}

const createMatcher: (routes: Route[]) => Matcher = routes => {
  const finalRoutes: Route[] = routes.map(createRoute)
  const routeLength: number = finalRoutes.length
  const matcher: Matcher = pathname => {
    let finalPathname = cleanPath(pathname)
    for (let i = 0; i < routeLength; i++) {
      let route: Route = finalRoutes[i]
      let strMatches: RegExpExecArray | null = route.regexp.exec(finalPathname)
      if (!strMatches) {
        continue
      }
      let params: Params = getParams(strMatches, route.keys)
      return {
        path: route.path,
        params
      }
    }
    return false
  }

  return matcher
}

export default createMatcher

const createRoute: (route: Route) => Route = route => {
  let finalRoute: Route = Object.assign({}, route)
  let keys: pathToRegexp.Key[] = (finalRoute.keys = [])
  finalRoute.regexp = pathToRegexp(finalRoute.path, keys)
  return finalRoute
}

const getParams: (
  strMatches: RegExpExecArray,
  keys: pathToRegexp.Key[]
) => Params = (matches, keys) => {
  let params: Params = {}
  for (let i = 1, len = matches.length; i < len; i++) {
    let key = keys[i - 1]
    if (key) {
      if (typeof matches[i] === "string") {
        params[key.name] = decodeURIComponent(matches[i])
      } else {
        params[key.name] = matches[i]
      }
    }
  }
  return params
}

const cleanPath: (path: string) => string = path => {
  return path.replace(/\/\//g, "/")
}
