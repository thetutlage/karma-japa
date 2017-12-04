module.exports = function (grunt) {
  grunt.initConfig({
    pkgFile: 'package.json',
    files: {
      adapter: [
        'src/adapter.js'
      ]
    },
    browserify: {
      tape: {
        src: ['src/japa.js'],
        dest: 'lib/japa.js',
        options: {
          browserifyOptions: {
            standalone: 'japa'
          }
        }
      }
    },
    build: {
      adapter: '<%= files.adapter %>'
    },
    eslint: {
      target: [
        '<%= files.adapter %>',
        'gruntfile.js',
        'lib/index.js',
        'tasks/*.js',
        'test/**/*.js'
      ]
    },
    karma: {
      adapter: {
        configFile: 'karma.conf.js'
      }
    }
  })

  require('load-grunt-tasks')(grunt)
  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadTasks('tasks')
  grunt.registerTask('default', ['browserify', 'build', 'test'])
  grunt.registerTask('test', ['karma'])
}
