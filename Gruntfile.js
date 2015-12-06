module.exports = function (grunt) {

    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        //watches content related changes
        watch        : {
            sass: {
                files  : ['sass/**/*.scss'],
                tasks  : [
                    'sass'
                ]
            },
            jade: {
                files  : ['jade/**/*.jade'],
                tasks  : [
                    'jade'
                ]
            }
        },
        // Jade compil
        jade : {
            compile: {
                files: [{
                    expand: true,
                    cwd: "./jade",
                    src: ["**/*.jade", "!tutos", "!include/*"],
                    dest: ".",
                    ext: ".html"
                }, {
                    expand: true,
                    cwd: "./jade/tutos",
                    src: ["**/*.jade"],
                    dest: "./tutos",
                    ext: ".html"
                }]
            }
        },
        // Sass compil
        sass         : {
            options: {
                cacheLocation: '.tmp/.sass-cache'
            },
            dev    : {
                options: {
                    style: 'compressed'
                },
                files: [{
                    expand: true,
                    cwd   : 'sass',
                    dest  : 'css',
                    src   : ['main.scss'],
                    ext   : '.css'
                }]
            }
        },
        browserSync: {
            bsFiles: {
                src : ['css/*.css', '*.html']
            },
            options: {
                watchTask: true,
                server: {
                    baseDir: "./"
                }
            }
        }
    });

    grunt.registerTask('default', 'Start working', [
        'browserSync',
        'watch'
    ]);
};


