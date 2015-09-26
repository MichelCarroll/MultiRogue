var grunt = require('grunt');
var path = require('path');

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
                'src': ['dist/server']
            },
            client: {
                'src': ['dist/client']
            },
            tmp: {
                'src': ['tmp/common']
            }
        },
        dynamic_class_loader: {
            common: {
                files: {
                    src: ['src/common/*.ts'],
                    dest: 'tmp/common/DynamicClassLoader.ts'
                }
            }
        },
        typescript: {
            default: {
                src: ["tmp/**/*.ts"],
                dest: 'tmp',
                options: {
                    module: 'commonjs', //or commonjs
                    target: 'es5', //or es3
                    rootDir: 'tmp',
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
            pretranspile: {
                files: [{
                    src: '**/*',
                    dest: 'tmp',
                    cwd: 'src',
                    expand: true
                }]
            },
            server: {
                files: [{
                    src: '**/*.js',
                    dest: 'dist/server/common',
                    cwd: 'tmp/common',
                    expand: true
                }, {
                    src: '**/*.js',
                    dest: 'dist/server/lib',
                    cwd: 'tmp/server',
                    expand: true
                }, {
                    src: 'src/server/main.js',
                    dest: 'dist/server/main.js'
                }]
            },
            client: {
                src: '**',
                dest: 'dist/client',
                cwd: 'src/client/web',
                expand: true
            },
            test: {
                files: [{
                    src: '**/*.js',
                    dest: 'test/build',
                    cwd: 'tmp',
                    expand: true
                }]
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'nyan',
                    quiet: false
                },
                src: ['test/suits/*.js']
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerMultiTask('dynamic_class_loader', '', function() {
        var done = this.async();
        var content = '';
        var i=0;
        var src = this.files[0];
        var dist = this.files[1];

        var classNames = [];

        src.src.forEach(function(f){
            var filename = path.basename(f);
            var className = filename.replace('.ts', '');
            if(grunt.file.read(f).match(new RegExp('interface[ ]+'+className+' ','g'))) {
                ++i;
                return;
            }
            classNames.push(className);
            content += 'import '+className+' = require(\'.\/'+className+'\'); \n\n';
            if( ++i >= src.src.length) {
                content += 'var createInstance = function(className, args) {\n'+
                    'switch(className) {\n';

                classNames.forEach(function(className) {
                   content += 'case "'+className+'":\n'+
                       '  var obj = Object.create('+className+'.prototype);\n' +
                       '  obj.constructor.apply(obj, args);\n'+
                       '  return obj;\n'+
                       'break;\n';
                });

                content += '   }\n'+
                '};\n\n'+

                'export = createInstance;\n';

                grunt.file.write(dist.orig.src[0], content)
                done(true);
            }
        });


    });

    grunt.registerTask('transpile', ['copy:pretranspile', 'dynamic_class_loader', 'typescript']);

    grunt.registerTask('_client', ['browserify:client', 'uglify:client', 'copy:client']);
    grunt.registerTask('_server', ['copy:server']);

    grunt.registerTask('client', ['clean', 'transpile', '_client']);
    grunt.registerTask('server', ['clean', 'transpile', '_server']);

    grunt.registerTask('test', ['default', 'copy:test', 'mochaTest']);
    grunt.registerTask('default', ['clean', 'transpile', '_client', '_server']);
};
