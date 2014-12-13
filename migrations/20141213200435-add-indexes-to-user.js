"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addIndex(
      'Users',
      ['email'],
      {
        indexName: 'UserHasUniqueEmail',
        indicesType: 'UNIQUE'
      }
    )
    migration.addIndex(
      'Users',
      ['token'],
      {
        indexName: 'UserHasUniqueToken',
        indicesType: 'UNIQUE'
      }
    )
    done();
  },

  down: function(migration, DataTypes, done) {
    migration.removeIndex('User', 'UserHasUniqueEmail');
    migration.removeIndex('User', 'UserHasUniqueToken');
    done();
  }
};
