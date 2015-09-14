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
                dest: 'dist/compiled',
                options: {
                    module: 'commonjs', //or commonjs
                    target: 'es5', //or es3
                    rootDir: 'src',
                    sourceMap: true,
                    declaration: true
                }
            }
        },
        browserify: {
            client: {
                files: {
                    'dist/script.js': [
                        "dist/compiled/*.js",
                        "src/main.js",
                    ]
                }
            },
            options: {
                debug: true,
                transform: []
            }
        },
        uglify: {
            client: {
                options: {
                    sourceMap: true,
                    sourceMapFile: 'dist/script.js.map'
                },
                files: {
                    'dist/script.min.js': 'dist/script.js'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-typescript');

    grunt.registerTask('default', ['typescript', 'browserify', 'uglify']);
};
