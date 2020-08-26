// import Home from './Home'
// import About from './About'
// import Test from './Test'

export default [
  {
    path: "/",
    page: () => import("./Home"),
  },
  {
    path: "/about",
    page: () => import("./About"),
  },
  {
    path: "/test",
    page: () => import("./Test"),
  },
];
