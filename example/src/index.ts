export default [
  {
    path: '/',
    page: () => import('./Home')
  },
  {
    path: '/about',
    page: () => import('./About')
  }
]