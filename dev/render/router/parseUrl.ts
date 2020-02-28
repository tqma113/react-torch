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

export default function parseURL(url: URL): URLObject {
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