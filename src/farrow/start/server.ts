import path from 'path'
import { Http } from 'farrow-http'
import { useReactView } from 'farrow-react'
import { createAsyncPipeline, createContainer } from 'farrow-pipeline'
import { pureTorch } from './index'
import { mergeConfig } from '../../internal/config'
import { runRender } from '../render'
import {
  TORCH_DIR,
  TORCH_CLIENT_DIR,
  TORCH_PUBLIC_PATH,
  TORCH_ASSETS_FILE_NAME,
} from '../../index'
import type { RequestInfo, MaybeAsyncResponse } from 'farrow-http'
import type { Middleware, MiddlewareInput, MaybeAsync } from 'farrow-pipeline'
import type { TorchConfig, RenderContext, Assets } from '../../index'

export const startServer = (
  draftConfig: TorchConfig,
  apis: Middleware<RequestInfo, MaybeAsyncResponse>[],
  transits: MiddlewareInput<RenderContext, MaybeAsync<JSX.Element>>[]
) => {
  return new Promise<number>(async (resolve, reject) => {
    const http = Http()

    http.route('/api').use(...apis)

    const config = mergeConfig(draftConfig)
    const torch = await pureTorch(config)

    http.serve('/', torch.static())

    http.use(async (req) => {
      const ReactView = useReactView({
        docType: '<!doctype html>',
        useStream: true,
      })
      const url = req.pathname

      const pipeline = createAsyncPipeline<RenderContext, JSX.Element>()
      const container = createContainer()

      pipeline.use(...transits)

      pipeline.use(async (input) => {
        return await runRender(torch.render, input)
      })
      const assertPath = path.resolve(
        config.dir,
        TORCH_DIR,
        TORCH_CLIENT_DIR,
        TORCH_PUBLIC_PATH,
        TORCH_ASSETS_FILE_NAME
      )
      const assets = getAssets(require(assertPath)) as Assets
      const html = await pipeline.run(
        {
          url,
          assets,
          scripts: [],
          styles: [],
          others: {},
        },
        {
          container,
        }
      )
      return ReactView.render(html)
    })

    http.listen(torch.config.port, () => {
      resolve(torch.config.port)
    })
  })
}

function getAssets(stats: Record<string, string | string[]>) {
  return Object.keys(stats).reduce(
    (result: Record<string, string>, assetName) => {
      const value = stats[assetName]
      result[assetName] = Array.isArray(value) ? value[0] : value
      return result
    },
    {}
  )
}
