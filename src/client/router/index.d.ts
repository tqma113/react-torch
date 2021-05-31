import type { PageCreater } from '../page'
import type { DraftRoute, Params } from 'torch-router'
import type { ScriptPreload, StylePreload } from '../../'
export declare type Render<RT> = (
  module: PageModule | null,
  params: Params
) => Promise<RT>
export declare type AssetsContextType = {
  scripts: ScriptPreload[]
  styles: StylePreload[]
}
declare type Resources = {
  styles: StylePreload[]
  scripts: ScriptPreload[]
}
export declare type ResourcesTransform = (
  context: AssetsContextType,
  assets: Record<string, string>
) => Resources
export declare type RouteModule = {
  pageCreater: PageCreater<any, any> | Lazy<PageCreater<any, any>>
  transform?: ResourcesTransform
}
export declare type PageModule = {
  pageCreater: PageCreater<any, any>
  transform: ResourcesTransform
}
export declare type Route = DraftRoute<RouteModule>
export declare type RenderProps = {
  module: PageModule | null
  params: Params
}
export declare type Router = (path: string) => Promise<RenderProps>
export declare function createRouter(routes: Route[]): Router
export declare type Lazy<T> = () =>
  | T
  | Promise<{
      default: T
    }>
export {}
