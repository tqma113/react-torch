import path from 'path'
import compileClient from './client'
import compileServer from './server'

export default function build(_dir?: string) {
  const dir = _dir
    ? path.resolve(process.cwd(), _dir)
    : process.cwd()

  compileServer(dir)
    .then(() => compileClient(dir))
    .then(() => console.log('Compile finished!'))
    .then(() => process.exit())
    .catch(err => {
      throw err
    })
}