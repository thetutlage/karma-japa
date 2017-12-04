module.exports = function (config) {
  config.set({
    frameworks: ['japa'],
    files: [
      'src/adapter.js',
      'test/*.spec.js'
    ],
    plugins: [
      'karma-firefox-launcher',
      'karma-chrome-launcher',
      require.resolve('./')
    ],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: process.env.TRAVIS ? ['Firefox'] : ['Chrome'],
    singleRun: true,
    concurrency: Infinity
  })
}
