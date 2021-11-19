import { Http } from 'farrow-http'
import { useReactView } from 'farrow-react'
import { createAsyncPipeline, createContainer } from 'farrow-pipeline'
import start from '../dev'
import {
  webpackDevMiddleware,
  useDevContext,
} from './middleware/webpack-dev-middleware'
import { webpackHotMiddleware } from './middleware/webpack-hot-middleware'
import type { RequestInfo, MaybeAsyncResponse } from 'farrow-http'
import type { Middleware, MiddlewareInput, MaybeAsync } from 'farrow-pipeline'
import type { TorchConfig, RenderContext } from '../index'

export const startServer = (
  draftConfig: TorchConfig,
  apis: Middleware<RequestInfo, MaybeAsyncResponse>[],
  transits: MiddlewareInput<RenderContext, MaybeAsync<JSX.Element>>[]
) => {
  return new Promise<number>(async (resolve, reject) => {
    const http = Http()

    http.route('/api').use(...apis)

    const torch = await start(draftConfig)

    http.use(webpackDevMiddleware(torch.compiler))
    http.use(webpackHotMiddleware(torch.compiler, { log: false }))

    http.serve('/', torch.public())
    http.serve('/', torch.static())

    http.use(async (req) => {
      const ReactView = useReactView({
        docType: '<!doctype html>',
        useStream: true,
      })
      const webpackCTX = useDevContext()
      const url = req.pathname

      const pipeline = createAsyncPipeline<RenderContext, JSX.Element>()
      const container = createContainer()

      pipeline.use(...transits)

      pipeline.use(async (input) => {
        return await torch.render(input)
      })

      if (!webpackCTX.assets) {
        throw new Error(`Can't find webpack compile assets info.`)
      }

      const html = await pipeline.run(
        {
          url,
          assets: webpackCTX.assets,
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
