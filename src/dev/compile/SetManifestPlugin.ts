import { getCompilerHooks } from 'webpack-manifest-plugin'
import type { Compiler } from 'webpack'

export type SetManifestPluginOptions = {}

const defaults: SetManifestPluginOptions = {}

class SetManifestPlugin {
  options: SetManifestPluginOptions
  assets: object
  constructor(opts?: SetManifestPluginOptions) {
    this.options = Object.assign({}, defaults, opts)
    this.assets = {}
  }

  apply(compiler: Compiler) {
    const { beforeEmit } = getCompilerHooks(compiler);

    beforeEmit.tap('BatmanPlugin', (manifest: Record<string, string>) => {
      this.assets = manifest
      console.log(manifest)
      return manifest;
    })

    // afterEmit.tap('BatmanPlugin', (stats: any) => {
    //   // @ts-ignore
    //   stats.assets = this.assets
    // })
    // @ts-ignore
    // compiler.hooks.webpackManifestPluginAfterEmit.tap(
    //   'SetManifestPlugin',
    //   (manifest: Record<string, string>) => {
    //     // 返回 true 以输出 output 结果，否则返回 false
    //     this.assets = manifest
    //     return true
    //   }
    // )

    compiler.hooks.done.tap('SetManifestPlugin', (stats) => {
      // @ts-ignore
      console.log(stats, this.assets === stats.assets)
      // @ts-ignore
      stats.assets = this.assets
    })
  }
}

export default SetManifestPlugin
