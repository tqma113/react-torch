import type { Route } from '../../src'

const routes: Route[] = [
  {
    path: '/',
    module: () => import('./Home'),
  },
  {
    path: '/about',
    module: () => import('./About'),
  },
  {
    path: '/test',
    module: () => import('./Test'),
  },
]

export default routes
