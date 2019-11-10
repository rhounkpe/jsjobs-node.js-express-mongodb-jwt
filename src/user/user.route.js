'use strict';

const controller = require('./user.controller');

exports.initializePublicApiRoutes = app => {
  console.log(`Initializing public API routes for Users`);

  app.route('/auth/login')
    .post(controller.login);

  app.route('/auth/register')
    .post(controller.register);
};
