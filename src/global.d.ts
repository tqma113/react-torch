/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="webpack" />

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
}

declare var __DEV__: boolean

declare module 'gulp-clean-css' {
  declare function clean(): NodeJS.ReadWriteStream
  export = clean
}

declare module 'detect-port-alt' {
  declare function detect(defaultPort: number, host: string): Promise<number>
  export = detect
}

declare module '@routes' {
  declare const routes: import('./index').Route[]
  export = routes
}

declare module 'webpack-manifest-plugin' {
  import { WebpackPluginInstance, Compiler } from 'webpack'
  import { SyncWaterfallHook } from 'tapable'
  export type Options = {
    fileName: string
    map: (file: FileDescriptor) => FileDescriptor
  }
  export type FileDescriptor = {
    name: string
  }
  export class WebpackManifestPlugin extends WebpackPluginInstance {
    constructor(options: Options)
    apply(compiler: Compiler): void
  }

  export function getCompilerHooks(
    compiler: Compiler
  ): {
    afterEmit: SyncWaterfallHook
    beforeEmit: SyncWaterfallHook
  }
}
