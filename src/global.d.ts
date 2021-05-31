/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: import('./index').Env
  }

  interface Global {
    __DEV__: boolean
  }
}

interface Window {
  __DEV__: boolean
  __MODEL_STATE_LIST__: any[]
}

declare var __DEV__: boolean

declare module 'pnp-webpack-plugin' {
  declare function apply(compiler: import('webpack').Compiler): void
  declare function makePlugin(locator: any, filter: any): any
  declare function moduleLoader(module: NodeModule): any
  declare function tsLoaderOptions(options: any): any
  declare function forkTsCheckerOptions(options: any): any
  module topLevelLoader {
    declare function apply(compiler: import('webpack').Compiler): void
  }
  module bind {
    declare function apply(compiler: import('webpack').Compiler): void
  }
}

declare module '@routes' {
  declare const routes: import('./index').Route[]
  export = routes
}
