import warning from 'tiny-warning'

export type URL = string

export type URLObject = {
  href: string,
  protocol: string,
  host: string,
  path: string,
  pathname: string,
  search: string,
  hash: string
}

export function resolveURL(url: URL | URLObject): URLObject {
  if (typeof url === 'string') {
    return parseURL(url)
  }

  if (url.href) {
    return parseURL(url.href)
  }

  return parseURL(formatURL(url))
}

export function parseURL(url: URL): URLObject {
  let protocol = ''
  let host = ''
  let path = ''
  let pathname = ''
  let search = ''
  let hash = ''

  let rest = ''

  ;[protocol, rest] = url.split('://')
  ;[host, path] = rest.split('/')
  ;[pathname, rest] = path.split('?')
  ;[search, hash] = rest.split('#')

  return {
    href: url,
    protocol,
    host,
    path,
    pathname,
    search,
    hash
  }
}

export function formatURL(obj: URLObject): string {
  warning(
    !obj.href && !obj.host && !obj.path && !obj.pathname,
    `A url at least has 'host' or 'path', the url: ${JSON.stringify(obj)} doesn't.`
  )

  if (!!obj.href) {
    return obj.href
  }

  return (
    obj.protocol ? `${obj.protocol}://` : ''
    + obj.host ? clearHost(obj.host) : ''
    + obj.path ? `\\${clearPath(obj.path)}` : 
      obj.pathname ? `\\${clearPath(obj.pathname)}` : ''
      + obj.search ? `?${clearSearch(obj.search)}` : ''
      + obj.hash ? `#${clearHash(obj.hash)}` : ''
  )
}

export function clearProtocol(protocol: string): string {
  if (protocol.endsWith('://')) {
    protocol = protocol.slice(0, protocol.length - 3)
  } else if (protocol.endsWith(':')) {
    protocol = protocol.slice(0, protocol.length - 1)
  } else if (protocol.includes(':') || protocol.includes('/')) {
    warning(
      false,
      `Format of protocol: ${protocol} is wrong.`
    )
    
    protocol = protocol.replace(':', '')
    protocol = protocol.replace('/', '')
  }
  return protocol
}

export function clearHost(host: string): string {
  if (host.startsWith('//')) {
    host = host.slice(2)
  }
  return host
}

export function clearPath(path: string): string {
  if (path.charAt(0) === '/') {
    path = path.slice(1)
  }
  return path
}

export function clearSearch(search: string): string {
  if (search.charAt(0) === '?') {
    search = search.slice(1)
  }
  return search
}

export function clearHash(hash: string): string {
  if (hash.charAt(0) === '#') {
    hash = hash.slice(1)
  }
  return hash
}