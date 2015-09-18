var grunt = require('grunt');

module.exports = function (grunt) {

    grunt.initConfig({
        'watch': {
            server: {
                files: ["server/src/**/*.js", "Gruntfile.js"],
                tasks: ['default']
            },
            client: {
                files: ["client/src/**/*.js", "Gruntfile.js"],
                tasks: ['default']
            }
        },
        typescript: {
            server: {
                src: ["server/src/**/*.ts"],
                dest: 'server/dist',
                options: {
                    module: 'commonjs', //or commonjs
                    target: 'es5', //or es3
                    rootDir: 'server/src',
                    sourceMap: true,
                    declaration: true
                }
            },
            client: {
                src: ["client/src/**/*.ts"],
                dest: 'client/dist/compiled',
                options: {
                    module: 'commonjs', //or commonjs
                    target: 'es5', //or es3
                    rootDir: 'client/src',
                    sourceMap: true,
                    declaration: true
                }
            }
        },
        browserify: {
            client: {
                files: {
                    'client/dist/script.js': [
                        "client/dist/compiled/*.js",
                        "client/src/main.js",
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
                    sourceMapFile: 'client/dist/script.js.map'
                },
                files: {
                    'client/dist/script.min.js': 'client/dist/script.js'
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('client', ['typescript:client', 'browserify:client', 'uglify:client']);
    grunt.registerTask('server', ['typescript:server']);
    grunt.registerTask('default', ['client', 'server']);
};
