import path from "path";
import gulp from "gulp";
import uglify from "gulp-uglify";
import plumber from "gulp-plumber";
// @ts-ignore
import cleanCSS from "gulp-clean-css";

export default function copyPublic(dir: string) {
  return new Promise((resolve, reject) => {
    gulp.task("default", createTask(dir));

    const taskFunction: gulp.TaskFunction = (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    };
    gulp.series("default")(taskFunction);
  });
}

function createTask(dir: string) {
  const dest = path.resolve(dir, ".torch", "public");

  const allSrc = [dir + "/public/*", dir + "/public/**/*"];
  const all = () => {
    gulp.src(allSrc).pipe(plumber()).pipe(gulp.dest(dest));
  };

  const jsSrc = [
    dir + "/public/*.(js|ts|jsx|tsx)",
    dir + "/public/**/*.(js|ts|jsx|tsx)",
  ];
  const minifyJs = () => {
    gulp.src(jsSrc).pipe(plumber()).pipe(uglify()).pipe(gulp.dest(dest));
  };

  const cssSrc = [dir + "/public/*.css", dir + "/public/**/*.css"];
  const minifyCss = () => {
    gulp.src(cssSrc).pipe(plumber()).pipe(cleanCSS()).pipe(gulp.dest(dest));
  };

  return gulp.series(all, minifyJs, minifyCss);
}
