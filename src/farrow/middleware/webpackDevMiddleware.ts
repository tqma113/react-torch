import fs from 'fs'
import path from 'path'
import { HttpMiddleware } from 'farrow-http'
import { createContext } from 'farrow-pipeline'
import type { Compiler, Stats } from 'webpack'

export type Assets = { index: string; vendor: string } & Record<string, string>

export type WebpackDevContextType = {
  assets: Assets | null
  stats: Stats | null
}

const reporter = (state: boolean, stats: Stats) => {
  if (state) {
    const opts = {
      colors: true,
      context: process.cwd(),
    }
    if (stats.hasErrors()) {
      console.error(stats.toString(opts))
    } else if (stats.hasWarnings()) {
      console.warn(stats.toString(opts))
    } else {
      console.info(stats.toString(opts))
    }

    let message = 'Compiled successfully.'

    if (stats.hasErrors()) {
      message = 'Failed to compile.'
    } else if (stats.hasWarnings()) {
      message = 'Compiled with warnings.'
    }
    console.info(message)
  } else {
    console.info('Compiling...')
  }
}

const compile = (compiler: Compiler, context: WebpackDevContextType) => {
  let state = false
  let webpackStats: Stats | null = null
  let forceRebuild = false

  function done(stats: Stats) {
    // We are now on valid state
    state = true
    webpackStats = stats
    context.stats = stats
    // @ts-ignore
    context.assets = webpackStats.assets

    // Do the stuff in nextTick, because bundle may be invalidated
    // if a change happened while compiling
    process.nextTick(() => {
      // check if still in valid state
      if (!state) {
        return
      }

      // print webpack output
      reporter(state, stats)
    })

    // In lazy mode, we may issue another rebuild
    if (forceRebuild) {
      forceRebuild = false
      rebuild()
    }
  }

  function invalid() {
    if (state) {
      reporter(state, webpackStats!)
    }

    // We are now in invalid state
    state = false
  }

  function rebuild() {
    if (state) {
      state = false
      compiler.run((err: any) => {
        if (err) {
          console.error(err.stack || err)
          if (err.details) {
            console.error(err.details)
          }
        }
      })
    } else {
      forceRebuild = true
    }
  }

  compiler.hooks.invalid.tap('WebpackDevMiddleware', invalid)
  compiler.hooks.watchRun.tap('WebpackDevMiddleware', invalid)
  ;(!!compiler.webpack ? compiler.hooks.afterDone : compiler.hooks.done).tap(
    'WebpackDevMiddleware',
    done
  )

  const watching = compiler.watch(
    {
      aggregateTimeout: 200,
    },
    (err: any) => {
      if (err) {
        console.error(err.stack || err)
        if (err.details) {
          console.error(err.details)
        }
      }
    }
  )

  compiler.hooks.emit.tap('WebpackDevMiddleware', (compilation) => {
    // @ts-ignore
    if (compiler.hasWebpackDevMiddlewareAssetEmittedCallback) {
      return
    }

    compiler.hooks.assetEmitted.tap(
      'WebpackDevMiddleware',
      (file, { targetPath, content }) => {
        const dir = path.dirname(targetPath)
        const name = path.basename(targetPath)

        return fs.mkdir(dir, { recursive: true }, (mkdirError) => {
          if (mkdirError) {
            console.error(
              `${name}Unable to write "${dir}" directory to disk:\n${mkdirError}`
            )
          }

          return fs.writeFile(targetPath, content, (writeFileError) => {
            if (writeFileError) {
              console.error(
                `${name}Unable to write "${targetPath}" asset to disk:\n${writeFileError}`
              )
            }

            console.log(`${name}Asset written to disk: "${targetPath}"`)
          })
        })
      }
    )

    // @ts-ignore
    compiler.hasWebpackDevMiddlewareAssetEmittedCallback = true
  })

  return watching
}

const WebpackDevContext = createContext<WebpackDevContextType | null>(null)
const ctx: WebpackDevContextType = {
  assets: null,
  stats: null,
}

export const useDevContext = (): WebpackDevContextType => {
  // every farrow context provide a built-in hooks, Context.use()
  let ctx = WebpackDevContext.use()

  if (ctx.value === null) {
    throw new Error(`assest not found`)
  }

  return ctx.value
}

// define a provider middleware
export const webpackDevMiddleware = (compiler: Compiler): HttpMiddleware => {
  if (compiler) compile(compiler, ctx)

  return async (_, next) => {
    const userCtx = WebpackDevContext.use()

    userCtx.value = ctx

    return next()
  }
}
