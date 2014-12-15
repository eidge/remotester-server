module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  });

  grunt.registerTask('db:seed', 'Seed database', function(){
    var done   = this.async();
    var models = require(__dirname + '/models');
    models
      .User
      .findOrCreate({
        where: {
          email: 'hugoribeira@gmail.com',
          name: 'Hugo Ribeira',
          password_hash: '$2a$10$Ikr/Sd7kUIBKoxoIc8jK2uHD10aNLwdmlR5Yx2UWyET7BVuyEwAky',
          token: 'c3b6a0c402b26c8669175fb5b84d1c8389fe210297236b0b635aafbee5bd05ad248762ab749eee5a0edda0c6d4b744d9'
        }
      })
      .complete(function(err) {
        done(err === null);
      });
  });

  grunt.registerTask('db:drop', 'Seed database', function(){
    var models = require(__dirname + '/models');
    models.User.drop();
  });

  // Default task(s).
  grunt.registerTask('default', []);

};
