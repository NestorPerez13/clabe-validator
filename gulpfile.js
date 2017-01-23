// CLABE Validator
// https://github.com/center-key/clabe-validator
// MIT License

// Periodically check dependencies:
//    $ cd clabe-validator
//    $ npm outdated
//    $ npm update

var gulp =     require('gulp');
var header =   require('gulp-header');
var htmlhint = require('gulp-htmlhint');
var jasmine =  require('gulp-jasmine');
var jshint =   require('gulp-jshint');
var rename =   require('gulp-rename');
var replace =  require('gulp-replace');
var size =     require('gulp-size');
var uglify =   require('gulp-uglify');
var w3cjs =    require('gulp-w3cjs');

var pkg = require('./package.json');
var banner = '//CLABE Validator v' + [pkg.version, pkg.license, pkg.homepage].join(', ') + '\n';
var htmlHintConfig = { 'attr-value-double-quotes': false };
var jsHintConfig = { undef: true, unused: true, esversion: 6, predef: ['module', 'require'] };

function setVersion() {
   var stream = gulp.src(['clabe.js', 'README.md'])
      .pipe(replace(/v\d+[.]\d+[.]\d+/, 'v' + pkg.version))  //ex: "v0.0.0"
      .pipe(gulp.dest('.'));
   return stream;
   }

function analyze() {
   gulp.src('*.html')
      .pipe(w3cjs())
      .pipe(w3cjs.reporter())
      .pipe(htmlhint(htmlHintConfig))
      .pipe(htmlhint.reporter());
   gulp.src(['clabe.js', 'gulpfile.js'])
      .pipe(jshint(jsHintConfig))
      .pipe(jshint.reporter());
   }

function minify() {
   gulp.src(['clabe.js'])
      .pipe(rename('clabe.min.js'))
      .pipe(uglify())
      .pipe(header(banner))
      .pipe(size({ showFiles: true }))
      .pipe(gulp.dest('.'));
   }

function specRunner() {
   var specTerms = ['describe', 'it', 'expect'];
   jsHintConfig.predef = jsHintConfig.predef.concat(specTerms);
   gulp.src('spec.js')
      .pipe(jshint(jsHintConfig))
      .pipe(jshint.reporter())
      .pipe(jasmine({ verbose: true }));
    }

gulp.task('version', setVersion);
gulp.task('analyze', ['version'], analyze);
gulp.task('minify',  ['version'], minify);
gulp.task('spec',    ['version'], specRunner);
gulp.task('default', ['analyze', 'minify', 'spec']);
