import path from 'path'

const TORCH_EXTERNALS = [
  'react-torch/page',
  'react-torch/store',
  'react-torch/dev',
  'react-torch/start',
  'react-torch/build',
  'react-torch/hook',
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

  let map: Record<string, boolean> = {}
  dependencies = dependencies.filter((name) => {
    if (map[name]) {
      return false
    }
    map[name] = true
    return true
  })

  return [...dependencies, ...TORCH_EXTERNALS]
}
