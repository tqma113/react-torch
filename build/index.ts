import path from 'path'
import compile from './compile'
import renderCompile from './renderCompile'

export default function build(_dir?: string) {
  const dir = _dir
    ? path.resolve(process.cwd(), _dir)
    : process.cwd()

    renderCompile(dir)
      .then(() => compile(dir))
      .then(() => console.log('Compile finished!'))
      .then(() => process.exit())
      .catch(err => {
        throw err
      })
}