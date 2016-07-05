'use strict';

/***********************************
 * 模块加载
 ***********************************/
var gulp            = require('gulp');
var $               = require('gulp-load-plugins')();
var browserSync     = require('browser-sync');

/***********************************
 * 配置
 ***********************************/
var browserSyncOption ={
    server:{
      baseDir: './src'
    },
    open:true,                  
    port:8088                      
}

/***********************************
 * 资源路径
 ***********************************/
var htmlRouteArr = ['./src/*.html',
                    './src/html/**/*.html'
                    ];
var cssRouteArr  = ['./src/css/*.css'];
var jsRouteArr   = ['./src/js/*.js',
                    './src/js/config/*.js',
                    './src/js/service/*.js',
                    './src/js/filter/*.js',
                    './src/js/directive/*.js',
                    './src/js/controller/*.js'
                    ];

/***********************************
 * 任务
 ***********************************/
gulp.task('default',['browserSync','scripts','watch'],function(){
	console.log('ok');
});

gulp.task('browserSync',function(){
  browserSync(browserSyncOption);
});

//js
gulp.task('scripts', function() {
    return gulp.src(jsRouteArr)
        .pipe($.ngAnnotate())
        .pipe($.concat('all.min.js'))
        .pipe(gulp.dest('./src/'))
        .pipe(browserSync.reload({stream:true}));
});

//html
gulp.task('html', function() {
    return gulp.src(htmlRouteArr)
        .pipe(browserSync.reload({stream:true}));
});

//css
gulp.task('css', function() {
    return gulp.src(htmlRouteArr)
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('watch', function() {
    gulp.watch(jsRouteArr,   ['scripts']);
    gulp.watch(htmlRouteArr, ['html']);
    gulp.watch(cssRouteArr,  ['css']);
});



