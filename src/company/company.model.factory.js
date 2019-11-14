'use strict';
const connectionProvider = require('../config/connection.provider');
const serverSettings = require('../config/server.settings');
const { LoginSchema, CompanySchema, } = require('./company.schemas');

exports.getCompanyModel = async function () {
  try {
    const conn = await connectionProvider(serverSettings.mongo.serverUrl, serverSettings.mongo.database);
    return conn.model("Company", CompanySchema);
  } catch (e) {
    throw e;
  }
};


exports.getLoginModel = async function () {
  try {
    const conn = await connectionProvider(serverSettings.mongo.serverUrl, serverSettings.mongo.database);
    return conn.model("Login", LoginSchema);
  } catch (err) {
    throw err;
  }
};
