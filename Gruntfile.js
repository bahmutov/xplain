/*global module:false*/
module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                ignores: [
                'src/html-generation/assets/jquery-2.0.0.min.js',
                'src/html-generation/assets/jquery.tooltipster.min.js',
                'src/**/test/**/*.js',
                'src/**/cover/**'
                ]
            },
            'default': {
                src: [ 'index.js', 'src/**/*.js' ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('default', ['jshint']);
};