var gulp = require('gulp'),
    jslint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

gulp.task('hint', function() {
    return gulp.src(['*.js',
        'public/scripts/**/*.js',
        '!public/scripts/**/*.min.js',
        '!public/scripts/launch.js',
        '!*.min.js'
    ])

    .pipe(jslint())
        .pipe(jslint.reporter('default'));
});

gulp.task('js', function() {
    /* demo.js */
    gulp.src(['public/scripts/core/**/*.js',
            'public/scripts/**/**/*.js',
            /* not include */
            '!public/scripts/controllers/**/*.js',
            '!public/scripts/app.js',
            '!public/scripts/launch.js'
        ])
        .pipe(concat('demo.js'))
        // .pipe(uglify())
        .pipe(gulp.dest('public'));

    /* all.js */
    return gulp.src(['public/scripts/app.js',
            'public/scripts/controllers/**/*.js',
            /* not include */
            '!public/scripts/**/*.min.js'
        ])
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public'))
});

gulp.task('foo', function() {
    /* bower_components.js */
    return gulp.src(['public/scripts/core/modules/templateOverrides.js', ])
        .pipe(concat('foo.js'))
        .pipe(uglify({
            options: {
                mangle: false
            }
        }))
        .pipe(gulp.dest('public'))
});