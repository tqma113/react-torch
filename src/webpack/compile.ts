import webpack from 'webpack'
import rimrsf from 'rimraf'

import { Options } from './index';

import generateServerConfig from './server.config'
import generateClientConfig from './client.config'

export interface Compile {
  (options: Options): void
}

const compile: Compile = (options) => {
  rimrsf(options.public, (e) => {
    console.log(e)
  })
  
  webpack(generateServerConfig(options), (err, stats) => {
    console.log(err)
    console.log(stats.toString())
  })

  webpack(generateClientConfig(options), (err, stats) => {
    console.log(err)
    console.log(stats.toString())
  })
}

export default compile