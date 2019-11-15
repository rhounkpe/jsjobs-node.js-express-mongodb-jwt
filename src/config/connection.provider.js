'use strict';

const mongoose = require('mongoose');
const Promise = require('bluebird');
const serverConfig = require('./server.settings');

mongoose.Promise = Promise;

const _internalConnectionPool = {};

module.exports = function (url, database, options) {
  // remove Deprecation Warnings
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useUnifiedTopology', true);

  const opts = Object.assign({}, {
    server: {
      poolSize: 5
    }
  }, options);

  return new Promise(function (resolve, reject) {
    const address = `${serverConfig.mongo.serverUrl}/${serverConfig.mongo.database}`;

    if (!(_internalConnectionPool[address])) {
      try {
        const conn = mongoose.createConnection(address, opts);
        conn.on('open', function () {
          _internalConnectionPool[address] = conn;
          resolve(_internalConnectionPool[address]);
        });
        conn.on('error', function (err) {
          console.error('MongoDB error: %s', err);
        });
      } catch (e) {
        reject(e);
      }
    } else {
      return resolve(_internalConnectionPool[address]);
    }
  });
};
