import getConfig from './config'
import webpack from 'webpack'

export default function compileClient(dir: string) {
  const config = getConfig(dir)
  webpack(config)
}
