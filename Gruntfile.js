module.exports = function(grunt) {
  grunt.initConfig({
    clean: ['dist', 'gen'],

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
          yuicompress: true
        },
        files: {
          'dist/angular-toastr.min.css': 'src/toastr.less'
        }
      }
    },

    uglify: {
      prod: {
        files: {
          'dist/angular-toastr.min.js': 'src/toastr.js'
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
  grunt.loadNpmTasks('grunt-contrib-testem');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['less:dev', 'jshint', 'copy']);
  grunt.registerTask('prod', ['less:prod', 'uglify']);
};