import compileClient from './client'
import compileServer from './server'

export default function build(dir: string) {
  compileClient(dir)
  compileServer(dir)
}