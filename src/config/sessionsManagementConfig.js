'use strict';

const session = require('express-session');
const mongoStoreFactory = require('connect-mongo');

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

  app.use(session({
    store: new MongoStore({
      dbPromise: connectionProvider(serverSettings.serverUrl, serverSettings.database),
      ttl: (24 * 60 * 60), // 1 Day = 24 hours * 60 minutes * 60 secondes
    }),
    secret: serverSettings.session.password,
    saveUninitialized: true,
    resave: false,
    cookie: {
      path: '/',
      httpOnly: true,
      secure: true,
      maxAge: (24 * 60 * 60), // Cookie and Session TTL should be equivalent
    },
    // Protecting the session ID by hidding the name
    name: 'id'
  }));
};
