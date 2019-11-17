'use strict';
const cors = require('cors');

const controller = require('./company.controller');
const { validate } = require('../middlewares/validate.user.input');
const { companyValidationRules } = require('./company.validation.rules');

exports.initializePublicApiRoutes = async (app) => {
  console.log('Initializing public API routes for Companies...');

  app.route('/company/auth/login')
    .post(controller.login);

  app.route('/company/auth/register')
    .post(companyValidationRules(), await validate, controller.register);

  app.route('/company/auth/logout')
    .get(cors(), controller.logout);
};
