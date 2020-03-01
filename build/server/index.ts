import getConfig from './config'
import webpack from 'webpack'

export default function compileServer(dir: string) {
  const config = getConfig(dir)
  webpack(config)
}
