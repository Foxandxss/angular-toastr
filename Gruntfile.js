module.exports = function(grunt) {
  grunt.initConfig({
    clean: ['dist', 'gen'],

    concat: {
      dist: {
        src: ['src/toastr.js', 'gen/toastr.tpl.js'],
        dest: 'dist/angular-toastr.js'
      }
    },

    copy: {
      source: {
        src: 'src/toastr.js',
        dest: 'gen/toastr.js'
      },
      test: {
        src: 'test/toastr_spec.js',
        dest: 'gen/toastr_spec.js'
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

    ngtemplates: {
      app: {
        options: {
          module: 'toastr',
          prefix: 'templates/toastr'
        },
        cwd: 'src',
        src: 'toastr.html',
        dest: 'gen/toastr.tpl.js'
      }
    },

    uglify: {
      prod: {
        files: {
          'dist/angular-toastr.min.js': 'dist/angular-toastr.js'
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
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['less:dev', 'jshint', 'copy:source', 'copy:test', 'ngtemplates']);
  grunt.registerTask('prod', ['less:prod', 'less:proddev', 'ngtemplates', 'concat', 'uglify']);
};