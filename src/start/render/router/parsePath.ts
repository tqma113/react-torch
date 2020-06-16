export type Path = string
export type PathPieces = {
  pathname?: string
  search?: string
  hash?: string
}

export default function parsePath(path: Path): PathPieces {
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