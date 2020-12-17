import path from 'path'
import gulp from 'gulp'
import chalk from 'chalk'
import log from 'fancy-log'
import uglify from 'gulp-uglify'
import plumber from 'gulp-plumber'
import cleanCSS from 'gulp-clean-css'

import { TORCH_DIR, TORCH_PUBLIC_DIR, TORCH_CLIENT_DIR } from '../../index'

export default function copyPublic(dir: string) {
  return new Promise<void>((resolve, reject) => {
    gulp.task('default', createTask(dir))

    gulp.series('default')((error) => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

function createTask(dir: string) {
  const dest = path.resolve(dir, TORCH_DIR, TORCH_CLIENT_DIR)

  const allSrc = [
    dir + `/${TORCH_PUBLIC_DIR}/*`,
    dir + `/${TORCH_PUBLIC_DIR}/**/*`,
  ]
  const all = () => {
    return gulp.src(allSrc).pipe(plumber()).pipe(gulp.dest(dest))
  }

  const jsSrc = [
    dir + `/${TORCH_PUBLIC_DIR}/*.(js|ts|jsx|tsx)`,
    dir + `/${TORCH_PUBLIC_DIR}/**/*.(js|ts|jsx|tsx)`,
  ]
  const minifyJs = () => {
    return gulp.src(jsSrc).pipe(plumber()).pipe(uglify()).pipe(gulp.dest(dest))
  }

  const cssSrc = [
    dir + `/${TORCH_PUBLIC_DIR}/*.css`,
    dir + `/${TORCH_PUBLIC_DIR}/**/*.css`,
  ]
  const minifyCss = () => {
    return gulp.src(cssSrc).pipe(plumber()).pipe(cleanCSS({}, (details: Record<string, any>) => {
      let percent = (
        (details.stats.minifiedSize / details.stats.originalSize) *
        100
      ).toFixed(2)
      let message = `${details.name}(${chalk.green(percent)}%)`
      log('gulp-clean-css:', message)
    })).pipe(gulp.dest(dest))
  }

  return gulp.series(all, minifyJs, minifyCss)
}
