'use strict';
const cors = require('cors');
const controller = require('./company.controller');
const { validationSchemaConfig } = require('../middlewares/validation.schema.config');

exports.initializePublicApiRoutes = app => {
  console.log('Initializing public API routes for Companies...');

  app.route('/company/auth/login')
    .post(controller.login);

  app.route('/company/auth/register')
    .post(validationSchemaConfig, controller.register);

  app.route('/company/auth/logout')
    .get(cors(), controller.logout);
};
