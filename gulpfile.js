'use strict';

var syntax = "sass", // Syntax: sass or scss;
   gulpversion = "4"; // Gulp version: 3 or 4

// Initialize modules
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const rsync = require("gulp-rsync");
const notify = require("gulp-notify");
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const concat = require("gulp-concat");
const jsmin = require("gulp-uglify");


// const scriptFiles = [
//    "app/libs/jquery/jquery.3.4.1.js",
//    "app/libs/bootstrap/js/bootsrap.min.js",
//    "app/js/main.js"
// ];




// Browser-task
gulp.task('browser-sync', () => {
   browserSync.init({
      server: {
         baseDir: "app"
      },
      notify: false
   });
});




// CSS task
gulp.task('styles', () => {
   return gulp
      .src("app/" + syntax + "/**/*." + syntax + "")
      .pipe(sass({ outputStyle: "expanded" }).on('error', sass.logError))
      .pipe(autoprefixer({
         cascade: false
      }))
      .pipe(gulp.dest('app/css'))
      .pipe(browserSync.stream());
});






gulp.task("scripts", function () {
   return (
      gulp
         .src([
            "app/libs/jquery/jquery.3.4.1.js",
            "app/libs/bootstrap/js/bootstrap.min.js",
            "app/libs/isotope/isotope.min.js",
            "app/js/main.js"
         ])
         .pipe(concat("scripts.min.js"))
         .pipe(jsmin())
         .pipe(gulp.dest("app/js"))
         .pipe(browserSync.reload({ stream: true }))
   );
});



gulp.task("code", function () {
   return gulp.src("app/*.html").pipe(browserSync.reload({ stream: true }));
});



gulp.task("rsync", function () {
   return gulp.src("app/**").pipe(
      rsync({
         root: "app/",
         hostname: "username@yousite.com",
         destination: "yousite/public_html/",
         // include: ['*.htaccess'], // Includes files to deploy
         exclude: ["**/Thumbs.db", "**/*.DS_Store"], // Excludes files from deploy
         recursive: true,
         archive: true,
         silent: false,
         compress: true
      })
   );
});



if (gulpversion == 3) {
   gulp.task("watch", ["styles", "scripts", "browser-sync"], function () {
      gulp.watch("app/" + syntax + "/**/*." + syntax + "", ["styles"]);
      gulp.watch(["libs/**/*.js", "app/js/main.js"], ["scripts"]);
      gulp.watch("app/**/*.html", ["code"]);
   });
   gulp.task("default", ["watch"]);
}

if (gulpversion == 4) {
   gulp.task("watch", function () {
      gulp.watch(
         "app/" + syntax + "/**/*." + syntax + "",
         gulp.parallel("styles")
      );
      gulp.watch(["libs/**/*.js", "app/js/main.js"], gulp.parallel("scripts"));
      gulp.watch("app/**/*.html", gulp.parallel("code"));
   });
   gulp.task(
      "default",
      gulp.parallel("watch", "styles", "scripts", "browser-sync")
   );
}




