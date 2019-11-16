'use strict';
const { isAdminAndCanListAllUsers, isAdminAndCanRemoveUsers } = require('../middlewares/user.middleware');
const controller = require('../admin/admin.controller');

exports.initializeAdminRoutes = (app) => {
  console.log('Initializing admin API routes...');

  app.route('/admin/users')
    .all(isAdminAndCanListAllUsers)
    .get(controller.getAllUsers);

  app.route('/admin/user')
    .all(isAdminAndCanRemoveUsers)
    .delete(controller.deleteSingleUser);
};
