import path from 'path'
import gulp from 'gulp'
import uglify from 'gulp-uglify'
import plumber from 'gulp-plumber'
import cleanCSS from 'gulp-clean-css'
import { TORCH_DIR, TORCH_PUBLIC_DIR } from '../../index'

export default function copyPublic(dir: string) {
  return new Promise((resolve, reject) => {
    gulp.task('default', createTask(dir))

    const taskFunction: gulp.TaskFunction = (error) => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    }
    gulp.series('default')(taskFunction)
  })
}

function createTask(dir: string) {
  const dest = path.resolve(dir, TORCH_DIR, TORCH_PUBLIC_DIR)

  const allSrc = [
    dir + `/${TORCH_PUBLIC_DIR}/*`,
    dir + `/${TORCH_PUBLIC_DIR}/**/*`,
  ]
  const all = () => {
    gulp.src(allSrc).pipe(plumber()).pipe(gulp.dest(dest))
  }

  const jsSrc = [
    dir + `/${TORCH_PUBLIC_DIR}/*.(js|ts|jsx|tsx)`,
    dir + `/${TORCH_PUBLIC_DIR}/**/*.(js|ts|jsx|tsx)`,
  ]
  const minifyJs = () => {
    gulp.src(jsSrc).pipe(plumber()).pipe(uglify()).pipe(gulp.dest(dest))
  }

  const cssSrc = [
    dir + `/${TORCH_PUBLIC_DIR}/*.css`,
    dir + `/${TORCH_PUBLIC_DIR}/**/*.css`,
  ]
  const minifyCss = () => {
    gulp.src(cssSrc).pipe(plumber()).pipe(cleanCSS()).pipe(gulp.dest(dest))
  }

  return gulp.series(all, minifyJs, minifyCss)
}
