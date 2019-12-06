import Koa from 'koa'
import webpack from 'webpack'
import rimrsf from 'rimraf'
import MemoryFS from 'memory-fs'
import KoaWebpackDevMiddleware from 'koa-wdm'

import { Options } from './index';

import generateServerConfig from './server.config'
import generateClientConfig from './client.config'

export interface Compile {
  (options: Options): Promise<Koa.Middleware>
}

const compile: Compile = async (options) => {
  rimrsf(options.public, (e) => {
    if (e) {
      console.log(`Fail to remove public dri: ${options.public}`, e)
    }
  })

	let mfs = new MemoryFS()

  const server = webpack(generateServerConfig(options))

  server.outputFileSystem = mfs
  server.watch({}, (err, stats) => {
    if (err) {
      console.log(err)
    }
    if (stats.hasErrors()) {
      console.log(stats.toString({
        colors: true
      }))
    }
  })

  const client = webpack(generateClientConfig(options))

  const clientMiddleware = KoaWebpackDevMiddleware(client)

  return clientMiddleware
}

export default compile