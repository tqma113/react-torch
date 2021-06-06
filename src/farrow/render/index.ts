import { createContainer, createContext, fromContainer, runHooks } from './context'
import type { Assets, ScriptPreload, StylePreload, Env, Side } from '../../index'

export type RenderProps = {
  url: string
  assets: Assets
  scripts: ScriptPreload[]
  styles: StylePreload[]
  others: Record<string, any>
}

export type EnvContext = {
  ssr: boolean
  env: Env
  side: Side
}

export type RenderContextType = RenderProps & EnvContext

export const RenderContext = createContext<RenderContextType | null>(null)

export const useRenderContext = () => {
  const context = RenderContext.use().value

  if (!context) {
    throw new Error('')
  }

  return context
}

export const useEnvContext = (envCtx: Partial<EnvContext>) => {
  const context = useRenderContext()

  RenderContext.set({
    ...context,
    ...envCtx,
    url: context.url,
    assets: context.assets,
    scripts: context.scripts,
    styles: context.styles,
    others: context.others
  })
}

export type Render = () => Promise<JSX.Element>

export const runRender = (render: Render, props: RenderProps) => {
  const container = createContainer({
    renderContext: RenderContext.create({
      ...props,
      ssr: false,
      env: 'production',
      side: 'server'
    })
  })

  const hooks = fromContainer(container)

  const result = runHooks(render, hooks)

  return result
}
