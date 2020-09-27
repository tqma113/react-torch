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
  __TORCH_DATA__: import('./index').TorchData
  __DEV__: boolean
}

declare var __DEV__: boolean

declare module 'pnp-webpack-plugin' {
  function apply(compiler: import('webpack').Compiler): void
  function makePlugin(locator: any, filter: any): any
  function moduleLoader(module: NodeModule): any
  function tsLoaderOptions(options: any): any
  function forkTsCheckerOptions(options: any): any
  module topLevelLoader {
    function apply(compiler: import('webpack').Compiler): void
  }
  module bind {
    function apply(compiler: import('webpack').Compiler): void
  }
}

declare module 'detect-port-alt' {
  declare function detect(defaultPort: number, host: string): Promise<number>
  export = detect
}

declare module '@routes' {
  declare const routes: import('./index').Route[]
  export = routes
}
