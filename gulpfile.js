// Include gulp
var gulp = require('gulp');

// Define base folders
var config = {
    htmlPath: './src/html/',
    imgPath: './src/images/',
    jsonPath: './src/data/',
    fontsPath: './src/fonts/',
    lessPath: './src/less/',
    bowerDir: './bower_components/',
    jsDir: './src/js/',
    dest: './public/'
}

// Include plugins
var bower = require('gulp-bower');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var less = require('gulp-less');
var series = require('stream-series');
var minifyHTML = require('gulp-minify-html');
var jsmin = require('gulp-jsmin');
var cleanCSS = require('gulp-clean-css');
var imageop = require('gulp-image-optimization');

// Istall bower packages
gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest(config.bowerDir))
});

// Move fonts to public folder
gulp.task('fonts', function() {
    return series(
            gulp.src(config.bowerDir + 'bootstrap/fonts/*.*'),
            gulp.src(config.bowerDir + 'font-awesome/fonts/*.*'),
            gulp.src(config.fontsPath + '**.*')
        )
        .pipe(gulp.dest('./public/fonts'));
});


// minify html
gulp.task('html', function() {
    return gulp.src(config.htmlPath + '**/*.html')
        .pipe(minifyHTML({
            quotes: true
        }))
        .pipe(gulp.dest(config.dest));
});


// Concatenate & Minify JS 
gulp.task('scripts', function() {
    return series(
            gulp.src(config.bowerDir + 'jquery/dist/jquery.js'),
            gulp.src(config.bowerDir + 'angular/angular.js'),
            gulp.src(config.bowerDir + 'angular-ui-router/release/angular-ui-router.js'),
            gulp.src(config.bowerDir + 'ngstorage/ngStorage.js'),
            gulp.src('./node_modules/ng-infinite-scroll/build/ng-infinite-scroll.js'),
            gulp.src(config.bowerDir + 'bootstrap/dist/js/bootstrap.js'),
            gulp.src(config.jsDir + '/jquery/**/*.js'),
            gulp.src(config.jsDir + '/angular/**/*.js')
        )
        .pipe(concat('main.js'))
        .pipe(jsmin())
        .pipe(rename({
            suffix: '.min'
        }))

    .pipe(gulp.dest(config.dest + 'js'));
});

//Compile Less files
gulp.task('less', function() {
    gulp.src(config.lessPath + 'main.less')
        .pipe(rename('all-less-compiled'))
        .pipe(less({
            style: 'compressed'
        }))
        .pipe(gulp.dest(config.lessPath));
});

// concat the compiled less file with the rest of css files from packackes and minify 
gulp.task('css', function() {
    return series(
            
            gulp.src(config.lessPath + 'all-less-compiled.css')

        )
        .pipe(concat('main.css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(config.dest + 'css'));

});

// Optimise images
gulp.task('img', function(cb) {
    gulp.src([config.imgPath + '**/*.png', config.imgPath + '**/*.jpg', config.imgPath + '**/*.gif', config.imgPath + '**/*.jpeg']).pipe(imageop({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })).pipe(gulp.dest('./public/images')).on('end', cb).on('error', cb);
});

// Watch for changes in files
gulp.task('watch', function() {
    // Watch .js files
    gulp.watch(config.jsDir + '**/*.js', ['scripts']);
    // Watch .less files
    gulp.watch(config.lessPath + '**/*.less', ['less']);
    // Watch .css files
    gulp.watch('./src/' + '**/**/*.css', ['css']);

    // Watch .html files
    gulp.watch(config.htmlPath + '**/*.html', ['html']);
    
    // Watch image files
    gulp.watch([config.imgPath + '**/*.png', config.imgPath + '**/*.jpg', config.imgPath + '**/*.gif', config.imgPath + '**/*.jpeg'], ['img']);
});

// Default Task
gulp.task('default', ['bower', 'fonts', 'html', 'img', 'scripts', 'less', 'css', 'watch']);