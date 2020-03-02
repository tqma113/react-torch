import compileClient from './client'
import compileServer from './server'

export default function build(dir: string) {
  compileServer(dir)
    .then(() => compileClient(dir))
    .then(() => console.log('Compile finished!'))
    .then(() => process.exit(1))
    .catch(err => {
      throw err
    })
}