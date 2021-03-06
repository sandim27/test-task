module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        /*  
            jshint: {
                options: {
                    curly: true,
                    eqeqeq: true,
                    immed: true,
                    latedef: true,
                    newcap: true,
                    noarg: true,
                    sub: true,
                    undef: true,
                    eqnull: true,
                    browser: true,
                    globals: {
                        jQuery: true,
                        $: true,
                        console: true                    
                    }
                },
                '<%= pkg.name %>': {
                    src: ['js/*.js']
                }
            }
        */
        concat: {           
            dist:{
                src:['bower_components\angular\angular.min.js','bower_components\angular-route\angular-route.min.js','js\app.js'],
                dest:'js/build.js'
            }
        },
        uglify: {
            options:{
                stripBanners: true,
                banner:'/*<%= pkg.name %> <%= pkg.version %> -v<%= grunt.template.today("yyyy-mm-dd") %>*/\n'               
            },
            build:{
                src: 'js/build.js',
                dest:'build/js/build.min.js'
            }
        },
        cssmin: {
            with_banner: {
                options:{                    
                    banner:'/*My css*/'
                },
                files:{
                   'build/css/build.css':['css/styles.css']
                }
            }
        },       
        compass: {                  
            dist: {                 
              options: {            
                sassDir:'sass',
                cssDir: 'css',
                config: 'config.rb'
              }
            }
        },
        watch: {
             compass: {
                files: ['sass/*.{scss,sass}'],
                tasks: ['compass:dist']
            },
            scripts: {
                files:['js/*.js'],
                tasks:['concat','uglify']
            },
            css: {
                files:['css/*.css'],
                tasks:['cssmin']
            }            
        },
    });


    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');


    grunt.registerTask('default', ['compass','concat','uglify','cssmin','watch']);

};