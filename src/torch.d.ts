/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
  }

  interface Global {
    __DEV__: boolean
  }
}

interface Window {
  __DEV__: boolean
}

declare var __DEV__: boolean;

declare module "core-js/stable" {}
declare module "regenerator-runtime/runtime" {}
declare module "pnp-webpack-plugin" {
  function apply(compiler: any): void
  function makePlugin(locator: any, filter: any): any
  function moduleLoader(module: NodeModule): any
  function tsLoaderOptions(options: any): any
  function forkTsCheckerOptions(options: any): any
  module topLevelLoader {
    function apply(compiler: any): void
  }
  module bind {
    function apply(compiler: any): void
  }
}