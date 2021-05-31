import fs from 'fs'
import path from 'path'
import { HttpMiddleware } from 'farrow-http'
import { createContext } from 'farrow-pipeline'
import {
  TORCH_DIR,
  TORCH_CLIENT_DIR,
  TORCH_PUBLIC_PATH,
  TORCH_ASSETS_FILE_NAME,
} from '../../index'

export type Assets = { index: string; vendor: string } & Record<string, string>

export type WebpackContextType = {
  assets: Assets | null
}

const WebpackContext = createContext<WebpackContextType | null>(null)
const ctx: WebpackContextType = {
  assets: null,
}

export const useWebpackCTX = (): WebpackContextType => {
  // every farrow context provide a built-in hooks, Context.use()
  let ctx = WebpackContext.use()

  if (ctx.value === null) {
    throw new Error(`assest not found`)
  }

  return ctx.value
}

// define a provider middleware
export const webpackMiddleware = (dir: string): HttpMiddleware => {
  const codeStr = fs.readFileSync(
    path.resolve(
      dir,
      TORCH_DIR,
      TORCH_CLIENT_DIR,
      TORCH_PUBLIC_PATH,
      TORCH_ASSETS_FILE_NAME
    ),
    'utf-8'
  )
  ctx.assets = getAssets(JSON.parse(codeStr)) as Assets

  return async (_, next) => {
    const userCtx = WebpackContext.use()

    userCtx.value = ctx

    return next()
  }
}

const getAssets = (stats: Record<string, string | string[]>) => {
  return Object.keys(stats).reduce(
    (result: Record<string, string>, assetName) => {
      const value = stats[assetName]
      result[assetName] = Array.isArray(value) ? value[0] : value
      return result
    },
    {}
  )
}
