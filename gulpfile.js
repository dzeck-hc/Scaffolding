var gulp         = require('gulp'), // Gulp
    jade         = require('gulp-jade'), // Jade
    pug          = require('gulp-pug'), // Pug
    stylus       = require('gulp-stylus'), // Stylus

    nib          = require('nib'), //nib - plugin
    autoprefixer = require('autoprefixer-stylus'), // Autoprefixer
    rename       = require('gulp-rename'),
    cleanCSS     = require('gulp-clean-css'),

    imagemin     = require('gulp-imagemin'), // Imagemin

    sourcemaps   = require('gulp-sourcemaps'), // Sourcemaps
    concat       = require('gulp-concat'), // Concat
    uglify       = require('gulp-uglify'), // uglify
    changed      = require('gulp-changed'), // Changed

    browsersync  = require('browser-sync'), // Browser-Sync
    notify       = require('gulp-notify');

var dev_path =
    {
        styl: 'dev/styl/',
        jade: 'dev/jade/',
        js:   'dev/js/',
        img:  'dev/img/',
        pug: 'dev/pug/'
    }


var build_path =
    {
        css:  'build/css/',
        html: 'build/',
        js:   'build/js/',
        img:  'build/img/'
    }

// Compile Jade
// gulp.task('jade', function(){
//     gulp.src([
//             dev_path.jade + '*.jade',
//             '!' + dev_path.jade + '_*.jade'
//         ])
//         .pipe(jade({pretty: true}))
//         .on('error', console.log)
//         .pipe(gulp.dest(build_path.html))
//         .pipe(notify({ message: 'HTML compiled!' }))
//         .pipe(browsersync.reload({stream: true}));
// });

// Compile Pug
gulp.task('pug', function(){
    gulp.src([
            dev_path.pug + '*.pug',
            '!' + dev_path.pug + '_*.pug',
            '!' + dev_path.pug + 'inlcudes/_*.pug'
        ])
        .pipe(pug({pretty: true}))
        .on('error', console.log)
        .pipe(gulp.dest(build_path.html))
        .pipe(notify({ message: 'HTML compiled!' }))
        .pipe(browsersync.reload({stream: true}));
});

// Compile Stylus
gulp.task('stylus', function(){
    gulp.src([
            dev_path.styl + '*.styl',
            '!' + dev_path.styl + '_*.styl',
            '!' + dev_path.styl + 'vendor/'
        ])
        .pipe(stylus({
            use: [
                autoprefixer(),
                nib()
                ],
            compress: false,
            sourcemap: {
                inline: true,
                sourceRoot: dev_path.styl
            }
        }))
        .on('error', console.log)
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename('style.css'))
        .pipe(gulp.dest(build_path.css))
        .pipe(notify({ message: 'CSS compiled!' }))
        .pipe(browsersync.reload({stream: true}));
});


// JavaScript
gulp.task('js', function(){
    gulp.src([
            dev_path.js + '**/*',
            '!' + dev_path.js + 'vendor/'
        ])
        .on('error', console.log)
        .pipe(concat('output.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(build_path.js))
        .pipe(notify({ message: 'Javascript concatenated and minified!' }))
        .pipe(browsersync.reload({stream: true}));
});


// Minification Images
gulp.task('images', function(){
    gulp.src([dev_path.img + '**/*'])
        .pipe(changed(build_path.img))
        .pipe(imagemin({ progressive: true }))
        .pipe(gulp.dest(build_path.img))
        .pipe(notify({ message: 'Images Optimization!' }))
        .pipe(browsersync.reload({stream: true}));
});


// Start Browser-Sync server
gulp.task('browsersync-server', function(){
    browsersync.init(null, {
        server: {baseDir: 'build/'},
        open: false,
        notify: true,
        reloadOnRestart: true
    });
});

//
// TRANSFER VENDOR FILES
//

gulp.task('vendor', function(){
    gulp.src(dev_path.styl + 'vendor/*').pipe(gulp.dest(build_path.css));
    gulp.src(dev_path.js + 'vendor/*').pipe(gulp.dest(build_path.js));
    gulp.src('dev/fonts/**/*').pipe(gulp.dest('build/fonts/'));
});


//
// WATCH TASK
//

gulp.task('watch', function(){
    //gulp.watch(dev_path.jade + '**/*.jade', ['jade']);
    gulp.watch(dev_path.pug + '**/*.pug', ['pug']);
    gulp.watch(dev_path.styl + '**/*.styl', ['stylus']);
    gulp.watch([dev_path.img + '**/*'], ['images']);
    gulp.watch(dev_path.js + '**/*.js', ['js']);

    gulp.watch([dev_path.styl + 'vendor/*', dev_path.js + 'vendor/*'], ['vendor']);
});

//
// DEFAULT TASK + JADE
//
// gulp.task('default', [
//     'vendor', 'jade', 'stylus', 'images', 'js', 'browsersync-server', 'watch',
// ]);

//
// DEFAULT TASK + PUG
//
gulp.task('default', [
    'vendor', 'pug', 'stylus', 'images', 'js', 'browsersync-server', 'watch',
]);

//
//BUILD PROJECT
//
gulp.task('build', ['pug', 'stylus', 'js']);

