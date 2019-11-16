'use strict';

const connectionProvider = require('../config/connection.provider');
const { UserSchema } = require('../user/user.schemas');
const serverSettings = require('../config/server.settings');

exports.getUserModel = async function () {
  try {
    const conn = await connectionProvider(serverSettings.mongo.serverUrl, serverSettings.mongo.database);

    return conn.model('User', UserSchema);
  } catch (err) {
    throw err;
  }
};
