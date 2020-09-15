import { dynamic } from '../../src'
import type { Route } from '../../src'

const routes: Route[] = [
  {
    path: '/',
    module: () => dynamic(import('./Home')),
  },
  {
    path: '/about',
    module: () => dynamic(import('./About')),
  },
  {
    path: '/test',
    module: () => dynamic(import('./Test')),
  },
]

export default routes
