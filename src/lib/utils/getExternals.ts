import path from 'path'

const TORCH_EXTERNALS = [
  'react-torch/dev',
  'react-torch/start',
  'react-torch/build',
]

export default function getExternals(dir: string): string[] {
  let dependencies: string[] = []

  let list: string[] = [
    path.resolve('package.json'),
    path.join(__dirname, '../../package.json'),
    path.join(dir, 'package.json'),
  ]

  while (true) {
    let item = list.shift()
    if (item === undefined) {
      break
    }

    try {
      let pkg = require(item)
      if (pkg.dependencies) {
        dependencies = dependencies.concat(Object.keys(pkg.dependencies))
      }
      if (pkg.devDependencies) {
        dependencies = dependencies.concat(Object.keys(pkg.devDependencies))
      }
    } catch (error) {
      // ignore error
    }
  }

  const map: Record<string, boolean> = {}
  dependencies = dependencies.filter((name) => {
    if (map[name]) {
      return false
    }
    map[name] = true
    return true
  })

  return [...dependencies, ...TORCH_EXTERNALS]
}
