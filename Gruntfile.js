module.exports = function(grunt) {
  grunt.initConfig({
    less: {
      dev: {
        files: {
          "gen/toastr.css": "src/toastr.less"
        }
      },
      prod: {
        options: {
          yuicompress: true
        },
        files: {
          "dist/angular-toastr.min.css": "src/toastr.less"
        }
      }
    },

    uglify: {
      prod: {
        files: {
          "dist/angular-toastr.min.js": "src/toastr.js"
        }
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

    watch: {
      scripts: {
        files: ['src/**/*', 'test/**/*_spec.js'],
        tasks: ['default']
      }
    },

    clean: ['dist', 'gen']
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-testem');

  grunt.registerTask('default', ['less:dev', 'copy']);
  grunt.registerTask('prod', ['less:prod', 'uglify']);
};