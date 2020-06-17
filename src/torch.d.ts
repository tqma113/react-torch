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