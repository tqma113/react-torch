import type { Route } from '../../src/client'

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
