
 module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        paths: grunt.file.readJSON('paths.json'),

        //////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////

        sass: {

            files: {
                '<%= paths.public %>/<%= paths.assets.styles %>/base.css'  : '<%= paths.source.sass %>/base.scss',          
            },

            prod: {
                options: {
                    sourcemap: true,
                    style: 'compressed',
                    precision: 10, // Workaround safari precision bug.
                },
                files: '<%= sass.files %>'
            },

            dev: {
                options: {
                    sourcemap: true,
                    style: 'nested', //compressed
                    precision: 10, // Workaround safari precision bug.
                },
                files: '<%= sass.files %>'
            }
        },

        //////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////

        // concat: {
        //     options: {
        //         separator: ';',
        //     },
        //     dist: {
        //         src: [
        //             '<%= paths.source.js %>/modules/battlefield.js',
        //             '<%= paths.source.js %>/modules/battlefield.js',
        //             '<%= paths.source.js %>/main.js'
        //         ], 
        //         dest: '<%= paths.source.js %>/compiled.site.js',
        //     },
        // },

        // uglify: {

        //     files: {
        //         '<%= paths.public %>/<%= paths.assets.scripts %>/site.min.js'  : '<%= concat.dist.dest %>',
        //     },

        //     prod: {
        //         options: {
        //             mangle: false,
        //             sourceMap: true,
        //             sourceMapIncludeSources: true,
        //             beautify: false,
        //             report: 'min',
        //             compress: true
        //         },
        //         files: '<%= uglify.files %>',
        //     },

        //     dev: {
        //         options: {
        //             mangle: false,
        //             sourceMap: true,
        //             sourceMapIncludeSources: true,
        //             beautify: true,
        //             report: 'min',
        //             compress: false
        //         },
        //         files: '<%= uglify.files %>',
        //     }
        // },

        requirejs: {
            index: {
                options: {
                    name: 'libs/almond-0.2.6',
                    include: 'main',
                    baseUrl: '<%= paths.source.js %>/',
                    mainConfigFile: '<%= paths.source.js %>/main.js',
                    out: '<%= paths.public %>/<%= paths.assets.scripts %>/main.min.js',
                    wrap: true,
                    optimize: 'none',
                }
            }
        },

        modernizr: {
            dist: {
                'devFile' : '<%= paths.bower_components %>/modernizr/modernizr.js',
                'outputFile' : '<%= paths.public %>/<%= paths.assets.scripts %>/modernizr.min.js',
                'uglify' : true,
                'parseFiles': true,
                'files' : {
                    'src': [
                        '<%= paths.public %>/<%= paths.assets.scripts %>/*',
                        '<%= paths.public %>/<%= paths.assets.styles %>/*'
                    ]
                },
                'matchCommunityTests': false,
                'tests' : [],
                'customTests': [
                    'videoautoplay'
                ],
                'parseFiles' : true,
                'extra': {
                    'shiv': false,
                    'printshiv': false,
                    'load': true,
                    'mq': false,
                    'cssclasses': true
                },
                'extensibility': {
                    addtest : false,
                    prefixed : false,
                    teststyles : false,
                    testprops : false,
                    testallprops : false,
                    hasevents : false,
                    prefixes : false,
                    domprefixes : false                    
                }
            }
        },

        /////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////

        bake: {
            dist: {
                options: {
                    content: '<%= paths.source.templates %>/content.json',
                    section: 'default'
                },
                files: {
                    '<%= paths.public %>/<%= paths.assets.html %>/index.html': '<%= paths.source.templates %>/index.html', //globbing not yet supported :(
                }
            },
        },

        prettify: {
            html: {
                expand: true,
                cwd: '<%= paths.public %>/<%= paths.assets.html %>/',
                ext: '.html',
                src: ['*.html'],
                dest: '<%= paths.public %>/<%= paths.assets.html %>/'
            }
        },

        imagemin: {
            assets: {
                files: [ {
                    expand: true,
                    cwd: '<%= paths.source.images %>/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: '<%= paths.public %>/<%= paths.assets.images %>/'
                }]
            }
        },


        /////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////

        // Sync data between the json different files.

        update_json: {

            // Sync package.json with bower.json
            bower: { 
                src: 'package.json',
                dest: 'bower.json',
                fields: [
                    'name',
                    'version'
                ]
            },

            // Sync paths.json with .bowerrc
            bowerrc: { 
                src: 'paths.json',
                dest: '.bowerrc',
                fields: {
                    'bower_components': 'directory'
                }
            }
        },

        // Remove existing files in the script, styles and html folder.

        clean: {
            scripts: { src: [ '<%= paths.public %>/<%= paths.assets.scripts %>' ] },
            styles:  { src: [ '<%= paths.public %>/<%= paths.assets.styles %>' ] },
            html:    { src: [ '<%= paths.public %>/<%= paths.assets.html %>' ] },
            fonts:   { src: [ '<%= paths.public %>/<%= paths.assets.fonts %>' ] },
            images:  { src: [ '<%= paths.public %>/<%= paths.assets.images %>' ] },
            videos:  { src: [ '<%= paths.public %>/<%= paths.assets.videos %>' ] },
        },

        // Replace place holders like {path.styles} in the baked html, css, js.

        replace: {
          assets: {
            src: [
            	'<%= paths.public %>/<%= paths.assets.styles %>/**/*.css', 
            	'<%= paths.public %>/<%= paths.assets.html %>/**/*.html', 
            	'<%= paths.public %>/<%= paths.assets.scripts %>/**/*.js'
            ], 
            overwrite: true, // overwrite matched source files
            replacements: [
                { from: "{path.styles}",  to: "/<%= paths.assets.styles %>" },
                { from: "{path.scripts}", to: "/<%= paths.assets.scripts %>" },
                { from: "{path.images}",  to: "/<%= paths.assets.images %>" },
                { from: "{path.html}",    to: "/<%= paths.assets.html %>" },
                { from: "{path.fonts}",   to: "/<%= paths.assets.fonts %>" },
                { from: "{path.videos}",  to: "/<%= paths.assets.videos %>" },
            ]
          }
        },

        /////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////

        connect: {
            server: {
                options: {
                    port: 9002,
                    livereload: true,
                    base: '<%= paths.public %>'
                },
            }
        },

        /////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////

        watch: {
            compile: {
                files: [
                    '<%= paths.source.sass %>/**/*.scss', 
                    '<%= paths.source.templates %>/**/*.html',
                    '<%= paths.source.js %>/**/*.js',
                    '<%= paths.source.templates %>/content.json'
                ],
                tasks: ['sass', 'requirejs', 'bake', 'prettify:html', 'replace:assets'],
                options: {
                  livereload: true,
                },
            }
        },

        browserSync: {
            dev: {
                bsFiles: {
                    src : [ '<%= paths.public %>/<%= paths.assets.styles %>/*.html', '<%= paths.public %>/<%= paths.assets.html %>/*.html' ]
                },
                options: {
                    proxy: "0.0.0.0:9002",
                    watchTask: true
                }
            }
        },

        // concurrent: {
        //     options: {
        //         logConcurrentOutput: true
        //     },
        //     compile: {
        //         tasks: ["watch:compile"]
        //     },
        //     replace: {
        //         tasks: ["watch:replace"]
        //     }
        // },

        copy: {
            fonts: {
                files: [
                    // includes files within path
                    {expand: true, cwd: '<%= paths.source.fonts %>/', src: ['**'], dest: '<%= paths.public %>/<%= paths.assets.fonts %>/', filter: 'isFile'},
                ]
            },
            images: {
                files: [
                    // includes files within path
                    {expand: true, cwd: '<%= paths.source.images %>/', src: ['**'], dest: '<%= paths.public %>/<%= paths.assets.images %>/', filter: 'isFile'},
                ]
            },
            videos: {
                files: [
                    // includes files within path
                    {expand: true, cwd: '<%= paths.source.videos %>/', src: ['**'], dest: '<%= paths.public %>/<%= paths.assets.videos %>/', filter: 'isFile'},
                ]
            },
        }
    });


    /////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////

    // Load npm tasks from the package.json
    require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

    /////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////

    // Syncs the different json files.
    grunt.registerTask('sync', ['update_json']); 

    // 




    grunt.registerTask('build', ['clean', 'copy:fonts', 'copy:videos', 'sass:prod', 'requirejs', 'bake:dist', 'prettify:html', 'replace:assets', 'modernizr', 'imagemin:assets']);

    grunt.registerTask('dev', ['clean', 'copy:fonts', 'copy:videos', 'sass:dev', 'requirejs', 'bake:dist', 'prettify:html', 'replace:assets', 'modernizr', 'imagemin:assets']);
    //grunt.registerTask('build', ['sass:dist', 'concat:dist', 'uglify:dist', 'bake:dist', 'replace:assets', 'modernizr']);


    grunt.registerTask('watchset', ['concurrent:compile', 'concurrent:replace']);

    grunt.registerTask('serve:dev', ['dev', 'connect:server', 'browserSync', 'watch:compile']);
    grunt.registerTask('serve:prod', ['build', 'connect:server', 'browserSync', 'watch:compile']);


};