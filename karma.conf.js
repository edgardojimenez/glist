// Karma configuration
// Generated on Mon Oct 07 2013 22:21:06 GMT-0500 (Central Daylight Time)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',

    // frameworks to use
    frameworks: ['mocha'],

    // list of files / patterns to load in the browser
    files: [
      'node_modules/expect.js/expect.js',
      'http://code.jquery.com/jquery-1.9.1.min.js',
      'http://cdnjs.cloudflare.com/ajax/libs/knockout/2.2.0/knockout-min.js',
        'scripts/medium.js',
        'scripts/modules/app.js',
        'scripts/modules/repository.js',
        'scripts/modules/service.js',
        'scripts/modules/cache.js',
        'scripts/modules/config.js',
        'scripts/modules/storage.js',
        'scripts/modules/common.js',
        'scripts/modules/grocery.js',
        'scripts/modules/product.js',
        'scripts/utils.js',
        'scripts/jquery.mobile.defaults.js',
        'http://code.jquery.com/mobile/1.3.2/jquery.mobile-1.3.2.min.js',
        // tests
        'test/modules/repositoryMock.js',
        'test/modules/storageMock.js',
        'test/modules/commonMock.js',
        'test/modules/app.js',
        'test/modules/storage.js',
        'test/modules/repository.js',
        'test/modules/service.js'
    ],

    // list of files to exclude
    exclude: [
      
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome'],

    plugins: [
        'karma-mocha',
        'karma-chrome-launcher'
    ],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
