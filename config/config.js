var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'devconf-2015-shops-br'
    },
    port: 8080,
  },

  test: {
    root: rootPath,
    app: {
      name: 'devconf-2015-shops-br'
    },
    port: 8080,
  },

  production: {
    root: rootPath,
    app: {
      name: 'devconf-2015-shops-br'
    },
    port: 8080,
  }
};


module.exports = config[env];
