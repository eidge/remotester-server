var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('users', {
    id: {type: 'int', primaryKey: true},
    name: 'string',
    email: 'string',
    password_hash: 'string'
  }, callback);
};

exports.down = function(db, callback) {
  callback();
};
