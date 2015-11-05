module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      //some code here
      options: {
        separator: ';'
      },
      dist:{
        src: ['public/client/app.js', 'public/client/createLinkView.js', 'public/client/link.js', 'public/client/links.js', 'public/client/linksView.js', 'public/client/linkView.js', 'public/client/router.js', 'public/lib/backbone.js', 'public/lib/handlebars.js', 'public/lib/jquery.js', 'public/lib/underscore.js'],
        dest: 'public/dist/built.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      //some stuff here
      my_target: {
        files: {
          'public/dist/output.min.js': ['public/dist/built.js']
        }
      }
    },

    jshint: {
      files: [
        // Add filespec list here
        'public/client/app.js', 'public/client/createLinkView.js', 'public/client/link.js', 'public/client/links.js', 'public/client/linksView.js', 'public/client/linkView.js', 'public/client/router.js'
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    'heroku-deploy' : {
      production: {
        deployBranch: 'master'
      }
    },

    shell: {
      target: {
        command: 'git push heroku master'
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  //add the deploy task
  grunt.loadNpmTasks('grunt-heroku-deploy');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('default', ['watch']);

  grunt.registerTask('heroku-deploy', ['shell']);
  
  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'jshint',
    'concat',
    'uglify',
    'test' 
  ]);

  // grunt.registerTask('upload', function(n) {
  //   if(grunt.option('prod')) {
  //     // add your production server task here
  //     grunt.registerTask('heroku:development', 'clean less mincss');
  //   } else {
  //     grunt.task.run([ 'server-dev' ]);
  //   }
  // });

  grunt.registerTask('deploy', 'this deploys stuff', function() {
    // add your deploy tasks here
    if(grunt.option('prod')) {
      // add your production server task here
      grunt.task.run('build');
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('heroku:production', 'build');

};
