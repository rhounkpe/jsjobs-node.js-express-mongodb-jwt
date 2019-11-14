'use strict';
const connectionProvider = require('../config/connection.provider');
const serverSettings = require('../config/server.settings');
const { JobSchema } = require('./job.schemas');

exports.getJobModel = async function () {
  try {
    const conn = await connectionProvider(serverSettings.mongo.serverUrl, serverSettings.mongo.database);
    return conn.model("Job", JobSchema);
  } catch (e) {
    throw e;
  }
};
