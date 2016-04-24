// Karma configuration
// Generated on Thu Feb 18 2016 19:08:33 GMT+0000 (Maroc)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha','chai'],


    // list of files / patterns to load in the browser
    files: [
        'assets/js/dependencies/sails.io.js',
		'assets/js/dependencies/jquery.js',
		'assets/js/dependencies/jquery.dataTables.js',
		'assets/js/dependencies/bootstrap.min.js',
		'assets/js/dependencies/select2.min.js',
		'assets/js/dependencies/angular.js',
        'assets/js/dependencies/angular-mocks.js',
        'assets/js/dependencies/stateMock.js',
		'assets/js/dependencies/angular-sails.js',
		'assets/js/dependencies/angular-ui-router.js',
		'assets/js/dependencies/textAngular-rangy.min.js',
		'assets/js/dependencies/textAngular-sanitize.min.js',
		'assets/js/dependencies/angular-resource.js',
		'assets/js/dependencies/angular-filter.js',
		'assets/js/dependencies/angular-ui.js',
		'assets/js/dependencies/angular-select2.js',
		'assets/js/dependencies/angular-animate.js',
		'assets/js/dependencies/moment-with-locales.min.js',
		'assets/js/dependencies/angular-moment.js',
		'assets/js/dependencies/pnotify.custom.js',
		'assets/js/dependencies/angular-pnotify.js',
		'assets/js/dependencies/ngDialog.js',
		'assets/js/dependencies/angular-datatables.js',
		'assets/js/dependencies/dataTables.responsive.js',
		'assets/js/dependencies/datetimepicker.js',
		'assets/js/dependencies/angular-ui-switch.js',
		'assets/js/dependencies/angular-file-upload-all.js',
		'assets/js/dependencies/angular-busy.js',
		'assets/js/dependencies/smart-table.js',
		'assets/js/dependencies/angular-select.js',
		'assets/js/dependencies/ui-router-tabs.js',
		'assets/js/dependencies/angular-breadcrumb.js',
		'assets/js/dependencies/angular-datatables.scroller.js',
		'assets/js/dependencies/angular-ellipsis.js',
		'assets/js/dependencies/angular-email-parser.js',
		'assets/js/dependencies/angular-odometer.js',
		'assets/js/dependencies/angular-route.js',
		'assets/js/dependencies/angular-sanitize.js',
		'assets/js/dependencies/angular.easypiechart.js',
		'assets/js/dependencies/c3-angular.min.js',
		'assets/js/dependencies/c3.min.js',
		'assets/js/dependencies/d3.min.js',
		'assets/js/dependencies/easypiechart.js',
		'assets/js/dependencies/jquery.sparkline.js',
		'assets/js/dependencies/loading-bar.js',
		'assets/js/dependencies/moment.js',
		'assets/js/dependencies/ng-wig.js',
		'assets/js/dependencies/odometer.js',
		'assets/js/dependencies/select2.js',
		'assets/js/dependencies/socket.io.js',
		'assets/js/dependencies/sticky.min.js',
		'assets/js/dependencies/textAngular.min.js',
		'assets/js/dependencies/toaster.js',
		'assets/js/dependencies/ui-utils.js',
      'assets/app/**/*.js',
      'test/assets/**/*.test.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
