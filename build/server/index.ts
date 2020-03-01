import getConfig from './config'
import webpack from 'webpack'

export default function compileServer(dir: string) {
  const config = getConfig(dir)
  return new Promise((resolve, reject) => {
    webpack(config, (error, stats) => {
      if (error) {
        reject(error)
      } else {
        console.log(
          '[webpack:server:build]',
          stats.toString({
            colors: true
          })
        )
        resolve()
      }
    })
  })
}
