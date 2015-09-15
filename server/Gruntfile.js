var grunt = require('grunt');

module.exports = function (grunt) {

    grunt.initConfig({
        'watch': {
            client: {
                files: ["src/**/*.js", "Gruntfile.js"],
                tasks: ['default']
            }
        },
        typescript: {
            client: {
                src: ["src/**/*.ts"],
                dest: 'dist',
                options: {
                    module: 'commonjs', //or commonjs
                    target: 'es5', //or es3
                    rootDir: 'src',
                    sourceMap: true,
                    declaration: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-typescript');

    grunt.registerTask('default', ['typescript']);
};
