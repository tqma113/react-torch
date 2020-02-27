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

export function parseURL(url: URL): URLObject {
  if (url.startsWith('//')) {
    url = url.slice(2)
  }

  const hostIndex = Math.max(url.indexOf('://'), 0)
  const pathIndex = Math.max(url.indexOf('/', hostIndex + 3), hostIndex + 3)
  const searchIndex = Math.max(url.indexOf('?', pathIndex + 1), pathIndex)
  const hashIndex = Math.max(url.indexOf('#', searchIndex + 1), searchIndex)

  const protocol = url.slice(0, hashIndex)
  const host = url.slice(hostIndex, pathIndex)
  const path = url.slice(pathIndex, url.length - 1)
  const pathname = url.slice(pathIndex, searchIndex)
  const search = url.slice(searchIndex, hashIndex)
  const hash = url.slice(searchIndex, url.length - 1)

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
  return (
    obj.protocol ? `${obj.protocol}://` : ''
    + obj.host ? 
  )
}