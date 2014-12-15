"use strict";

var bcrypt = require('bcrypt');
var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define(
    "User",
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password_hash: DataTypes.STRING,
      token: DataTypes.STRING,
    },
    {
      classMethods: {
        associate: function(models) {
          // associations can be defined here
        }
      },
      instanceMethods: {
        validatePassword: function(password) {
          if(!password || !this.getDataValue('password_hash')) return false;
          return bcrypt.compareSync(password, this.getDataValue('password_hash'));
        },
        createTokenIfNotExists: function() {
          if(!this.getDataValue('token'))
            this.setDataValue('token', crypto.randomBytes(48).toString('hex'));
          return this.save()
        }
      },
      getterMethods:{
        password_hash: function() { return null; /* We don't want this to get public */ }
      },
      setterMethods: {
        password: function(password) {
          return this.setDataValue('password_hash', bcrypt.hashSync(password, 10));
        }
      }
    }
  );

  return User;
};
