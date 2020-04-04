/*jslint
    white */
/* global
  grunt */
const sass = require('node-sass');

module.exports = function (grunt) {
  'use script';

  // Configs
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      build: {
        files: [
          {expand: true, cwd: 'src/', src: ['font/**'], dest: 'build/'},
          {expand: true, cwd: 'src/', src: ['img/**'], dest: 'build/'},
          {expand: true, cwd: 'src/', src: ['js/**'], dest: 'build/'}
        ]
      }
    },
    sass: {
      build: {
        options: {
          implementation: sass,
          style: 'compressed',
          sourcemap: 'none'
        },
        files:  [
          {
            expand: true,
            cwd: 'src/sass',
            src: ['**/*.scss', "!libs/*.scss", "!components/*.scss"],
            dest: 'build/css',
            ext: '.css'
          }
        ]
      }
    },
    connect: {
      server: {
        options: {
          keepalive: true,
          hostname: 'localhost',
          port: 4000,
          base: 'build/',
          open: true
        }
      }
    },
    pug: {
      build: {
        options: {
          pretty: true
        },
        files: [
          {
            cwd: "src",
            src: ["**/*.pug", "!templates/**/*.pug"],
            dest: "build",
            expand: true,
            ext: ".html"
          }
        ]
      }
    },
    clean: {
      build: {
        src: ['build/']
      }
    },
    watch: {
      files: ['src/**/*'],
      tasks: ['build']
    }
  });

  // Load NPM Tasks
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-ftp-push');
  grunt.loadNpmTasks('grunt-contrib-pug');


  // Registered Tasks
  grunt.registerTask('build',
    [
      'clean:build',
      'sass:build',
      'copy:build',
      'pug:build'
    ]);
  grunt.registerTask('wipe',
    [
      'clean:build'
    ]);
  grunt.registerTask('default',
    [
      'build'
    ]);
  grunt.registerTask('serve',
    [
      'build',
      'watch'
    ]);

  // FTP transfer task
  grunt.registerTask('deploy', 'A simple task that ftp\'s stuff.', function (){

    var hosts = grunt.file.readJSON('hosts.json');
    grunt.initConfig({
      ftp_push: {
        options: {
          authKey: "dev",
          host: hosts.dev.remoteurl,
          dest: hosts.dev.remotedir,
          port: 21,
          debug: false
        },
        full: {
          files: [
            {expand: true, cwd: 'build', src: ['**/*', '.htaccess']}
          ]
        }
      }
    });

    grunt.task.run([
      'ftp_push:full'
    ]);

  });
};
