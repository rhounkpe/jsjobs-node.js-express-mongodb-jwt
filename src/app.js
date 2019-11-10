const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const jobRoutes = require('./job/job.route');
const userRoutes = require('./user/user.route');

module.exports = () => {
  const app = express();


  app.use(bodyParser.urlencoded({ extended: true}));
  app.use(bodyParser.json());
  app.use(cors());


  const api = express.Router();
  const auth = express.Router();

  jobRoutes.initializePublicApiRoutes(app);
  userRoutes.initializePublicApiRoutes(app);




  app.use((req, res, next) => {
    console.warn(`${req.originalUrl} route not found on JsJobs server!`);
    next();
  });

  return app;
};
