module.exports = function(grunt) {
  grunt.initConfig({
    clean: ['dist', 'gen'],

    copy: {
      source: {
        expand: true,
        cwd: 'src',
        dest: 'gen',
        src: '*.js'
      },
      test: {
        src: 'test/toastr_spec.js',
        dest: 'gen/toastr_spec.js'
      },
      prod: {
        files: [{
          src: 'src/toastr.js',
          dest: 'dist/angular-toastr.js'
        }, {
          src: 'src/toastr.tpl.js',
          dest: 'dist/angular-toastr.tpl.js'
        }]
      }
    },

    jshint: {
      files: ['Gruntfile.js','src/**/*.js', 'test/toastr_spec.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    less: {
      dev: {
        files: {
          'gen/toastr.css': 'src/toastr.less'
        }
      },
      prod: {
        options: {
          cleancss: true
        },
        files: {
          'dist/angular-toastr.min.css': 'src/toastr.less'
        }
      },
      proddev: {
        files: {
          'dist/angular-toastr.css': 'src/toastr.less'
        }
      }
    },

    uglify: {
      prod: {
        files: {
          'dist/angular-toastr.min.js': 'src/toastr.js',
          'dist/angular-toastr.tpl.min.js': 'src/toastr.tpl.js'
        }
      }
    },

    watch: {
      scripts: {
        files: ['src/**/*', 'test/**/*_spec.js'],
        tasks: ['default']
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['less:dev', 'jshint', 'copy:source', 'copy:test']);
  grunt.registerTask('prod', ['less:prod', 'less:proddev', 'copy:prod', 'uglify']);
};