module.exports = function(grunt){

    /**
     * Load required Grunt tasks. These are all installed when running `npm install`.
     */
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    /**
     * This is the configuration object Grunt uses to give each
     * plugin its instructions
     */
    var taskConfig = {

        /**
         * Read the package.json file so we can access the package name and 
         * version.
         */
        pkg: grunt.file.readJSON("package.json"),

        /**
          * The banner is the comment that is placed at the top of our compiled
          * source files. It is first processed as a Grunt template, where the `<%=`
          * pairs are evaluated based on this very configuration object.
          */
        meta: {
            banner:
                '/**\n' +
                ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                ' * <%= pkg.homepage %>\n' +
                ' *\n' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
                ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' +
                ' */\n'
        },

        /**
          * Minify all javascript sources
          */
        uglify: {
            compile: {
                options: {
                    sourceMap: true,
                    banner: '<%= meta.banner %>'
                },
                files: {
                    'dist/jquery.viewportchecker.min.js': 'src/jquery.viewportchecker.js'
                }
            }
        },

        /**
         * Start watching for file changes to speed up the development process
         */
        delta: {
            options: {
                livereload: true
            },

            /**
             * When our JavaScript source files change, we want to run lint them and
             * run our unit tests.
             */
            jssrc: {
                files: [
                    'src/jquery.viewportchecker.js'
                ],
                tasks: [ 'jshint:src' ]
            },
        },

        /**
         * Validate the Javascript src file which is located in src directory
         */
        jshint: {
            src: [
                'src/jquery.viewportchecker.js'
            ],
        }
    };

    grunt.initConfig(taskConfig);

    /**
      * In order to make it safe to just compile or copy *only* what was changed,
      * we need to ensure we are starting from a clean, fresh build. So we rename
      * the `watch` task to `delta` (that's why the configuration var above is
      * `delta`) and then add a new task called `watch` that does a check
      * before watching for changes.
      */
    grunt.renameTask( 'watch', 'delta' );
    grunt.registerTask( 'watch', [ 'jshint:src', 'delta' ] );

    /**
     * Task which will minify the source and place it in the distribute directory
     */
    grunt.registerTask( 'compile', [ 'jshint:src', 'uglify:compile' ] );
}