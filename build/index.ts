import compileClient from './client'
import compileServer from './server'

export default function build(dir: string) {
  compileServer(dir)
    .then(() => compileClient(dir))
    .then(() => console.log('Compile finished!'))
    .catch(err => {
      throw err
    })
}