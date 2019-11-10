'use strict';

const controller = require('./job.controller');
const middleware = require('../middlewares/user.middleware');

exports.initializePublicApiRoutes = app => {
  console.log(`Initializing public API routes for Job`);


  app.route('/api/jobs')
    .get(controller.getAllJobs)
    .post(middleware.checkUserToken, controller.create);

  app.route('/api/jobs/:email')
    .get(controller.getAllJobsByUser);

  app.route('/jobs/:id')
    .get(controller.getJobById);


  app.route('/api/search/:term/:place?')
    .get(controller.search);
};
