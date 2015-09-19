var grunt = require('grunt');

module.exports = function (grunt) {

    grunt.initConfig({
        'watch': {
            default: {
                files: ["src/**", "Gruntfile.js"],
                tasks: ['default']
            }
        },
        typescript: {
            base: {
                src: ["src/**/*.ts"],
                dest: 'tmp',
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
                    'dist/client/scripts/script.js': [
                        "tmp/client/lib/*.js",
                        "tmp/common/*.js",
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
                    sourceMapFile: 'dist/client/scripts/script.js.map'
                },
                files: {
                    'dist/client/scripts/script.min.js': 'dist/client/scripts/script.js'
                }
            }
        },
        copy: {
            server: {
                src: 'src/server/main.js',
                dest: 'dist/server/main.js'
            },
            client: {
                src: '**',
                dest: 'dist/client',
                cwd: 'src/client/web',
                expand: true
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('client', ['typescript:base', 'browserify:client', 'uglify:client', 'copy:client']);
    grunt.registerTask('server', ['typescript:base', 'copy:server']);
    grunt.registerTask('default', ['client', 'server']);
};
