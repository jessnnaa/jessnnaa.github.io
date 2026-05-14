var gulp = require("gulp"),
  sass = require("gulp-dart-sass"),
  postcss = require("gulp-postcss"),
  autoprefixer = require("autoprefixer"),
  cssnano = require("cssnano"),
  sourcemaps = require("gulp-sourcemaps");
var browserSync = require("browser-sync").create();

// Put this after including our dependencies
var paths = {
  styles: {
    src: ["scss/*.scss", "scss/**/*.scss"],
    dest: "css",
  },
};

function style() {
  return gulp
    .src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on("error", sass.logError)
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

function reload(done) {
  browserSync.reload();
  done();
}

function watch() {
  browserSync.init({
    server: {
      baseDir: "./",
      index: "index.html",
    },
  });
  gulp.watch(paths.styles.src, style);
  gulp.watch(["./*.html", "pages/*.html", "pages/**/*.html"], reload);
}

exports.watch = watch;
