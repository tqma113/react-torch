import Koa from 'koa'
import webpack from 'webpack'
import rimrsf from 'rimraf'
import MemoryFS from 'memory-fs'
import KoaWebpackDevMiddleware from 'koa-wdm'

import { Options } from './index';

import generateServerConfig from './server.config'
import generateClientConfig from './client.config'

export interface Compile {
  (options: Options): Promise<Koa.Middleware & koaWebpack.CombinedWebpackMiddleware>
}

const compile: Compile = async (options) => {
  rimrsf(options.public, (e) => {
    console.log(e)
  })

	let mfs = new MemoryFS()

  const server = webpack(generateServerConfig(options)) as webpack.Compiler

  server.outputFileSystem = mfs
  server.watch({}, (err, stats) => {
    if (err) {
      throw err
    }
  })

  const client = webpack(generateClientConfig(options), (err, stats) => {
    console.log(err)
    console.log(stats.toString())
  })

  const clientMiddleware = await KoaWebpackDevMiddleware(client)

  return clientMiddleware
}

export default compile