'use strict';

const connectionProvider = require('../config/connection.provider');
const serverSettings = require('../config/server.settings');
const session = require('express-session');
const mongoStoreFactory = require('connect-mongo');

// const mongoose = require('mongoose');


module.exports = function sessionManagementConfig(app) {

  session.Session.prototype.login = function(company, cb) {
    const req = this.req;
    // avoid session fixation attack
    req.session.regenerate(function (err) {
      if (err) {
        cb(err);
      }
    });
    req.session.companyInfo = company;
    cb();
  };

  const MongoStore = mongoStoreFactory(session);

  //const connection = mongoose.connect('mongodb://127.0.0.1:27017/jsjobs', {useNewUrlParser: true});

  app.use(session({
    store: new MongoStore({
      url: 'mongodb://127.0.0.1:27017/jsjobs',
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      // dbPromise: connectionProvider(serverSettings.mongo.serverUrl, serverSettings.mongo.database),
      ttl: (24 * 60 * 60), // 1 Day = 24 hours * 60 minutes * 60 secondes
    }),
    secret: serverSettings.session.password,
    saveUninitialized: true,
    resave: false,
    cookie: {
      path: '/',
      httpOnly: true,
      secure: false,
      maxAge: (24 * 60 * 60), // Cookie and Session TTL should be equivalent
    },
    // Protecting the session ID by hidding the name
    name: 'session-id'
  }));
};
