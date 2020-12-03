import type { Plugin, Compiler } from 'webpack'

export type TestPluginOptions = {}

const defaults: TestPluginOptions = {}

class SetManifestPlugin implements Plugin {
  options: TestPluginOptions
  assets: object
  constructor(opts?: TestPluginOptions) {
    this.options = Object.assign({}, defaults, opts)
    this.assets = {}
  }

  apply(compiler: Compiler) {
    // @ts-ignore
    compiler.hooks.webpackManifestPluginAfterEmit.tap(
      'SetManifestPlugin',
      (manifest: Record<string, string>) => {
        // 返回 true 以输出 output 结果，否则返回 false
        this.assets = manifest
        return true
      }
    )

    compiler.hooks.done.tap('SetManifestPlugin', (stats) => {
      // @ts-ignore
      stats.assets = this.assets
    })
  }
}

export default SetManifestPlugin
