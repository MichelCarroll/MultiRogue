var grunt = require('grunt');

module.exports = function (grunt) {

    grunt.initConfig({
        'watch': {
            default: {
                files: ["src/**", "Gruntfile.js"],
                tasks: ['default']
            }
        },
        clean: {
            server: {
                'src': ['dist/server', 'tmp/server']
            },
            client: {
                'src': ['dist/client', 'tmp/client']
            }
        },
        typescript: {
            default: {
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
            server_common: {
                src: '**/*.js',
                dest: 'dist/server/common',
                cwd: 'tmp/common',
                expand: true
            },
            server_lib: {
                src: '**/*.js',
                dest: 'dist/server/lib',
                cwd: 'tmp/server',
                expand: true
            },
            server_main: {
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
    grunt.loadNpmTasks('grunt-contrib-clean');


    grunt.registerTask('_client', ['browserify:client', 'uglify:client', 'copy:client']);
    grunt.registerTask('_server', ['copy:server_common', 'copy:server_lib', 'copy:server_main']);

    grunt.registerTask('client', ['clean', 'typescript', '_client']);
    grunt.registerTask('server', ['clean', 'typescript', '_server']);

    grunt.registerTask('default', ['clean', 'typescript', '_client', '_server']);
};
