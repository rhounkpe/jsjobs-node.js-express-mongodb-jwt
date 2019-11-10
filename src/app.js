const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const config = require('./config/config');
const { checkUserToken } = require('./middlewares');

let data = require('../data/jobs');
let users = require('../data/users').users;

module.exports = () => {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: true}));
  app.use(bodyParser.json());
  app.use(cors());


  const api = express.Router();
  const auth = express.Router();
  const router = express.Router();


  let initialJobs = data.jobs;
  let addedJobs = [];

  const getAllJobs = () => {
    return [...addedJobs, ...initialJobs];
  };



  auth.post('/login', (req, res) => {
    console.log(`Req.body = ${req}`);
    if (req.body) {
      const email = req.body.email.toLocaleLowerCase();
      const password = req.body.password;

      const index = users.findIndex(user => user.email === email);

      let user;

      if ((index > -1) && (users[index].password === password)) {
        user = users[index];

        const token = jwt.sign({
          issuer: config.jwt.issuer,
          role: user.role,
          email: user.email,
        }, config.jwt.secret);
        res.status(200).json({
          success: true,
          token,
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'identifiant incorrects'
        });
      }
    } else {
      res.status(500).json({
        success: false,
        message: 'données manquantes'
      });
    }
  });


  auth.post('/register', (req, res) => {
    console.log('req.body: ', req.body);
    if (req.body) {
      const email = req.body.email.trim();
      const password = req.body.password.trim();
      const nickname = req.body.nickname.trim();
      const user = {
        id: Date.now(),
        email,
        nickname,
        password,
      };

      users = [user, ...users];

      res.json({
        success: true,
        user,
        users,
      });
    } else {
      res.json({
        success: false,
        message: 'Echec de la création de un nouvel utilisateur',
      });
    }
  });



  api.get('/jobs', (req, res) => {
    res.json(getAllJobs());
  });

  api.get('/jobs/:email', (req, res) => {
    const email = req.params.email;

    const jobs = getAllJobs().filter(job => job.email === email);

    res.status(200).json({
      success: true,
      jobs,
    });
  });

  api.post('/jobs', checkUserToken, (req, res) => {
    const job = req.body;
    console.log(job);
    addedJobs = [job, ...addedJobs];
    console.log('total number of jobs: ', getAllJobs().length);
    res.json(job);
  });

  api.get('/search/:term/:place?', (req, res) => {
    const term = req.params.term.toLowerCase().trim();

    let place = req.params.place;

    let jobs = getAllJobs().filter(
      job => (job.description.toLowerCase().includes(term) || job.title.toLowerCase().includes(term) ));

    if (place) {
      place = place.toLowerCase().trim();
      jobs = jobs.filter(
        job => (job.city.toLowerCase().includes(place))
      );
    }
    res.json({
      success: true,
      jobs
    });
  });

  api.get('/jobs/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const jobs = getAllJobs().filter(j => j.id === id);

    if (jobs.length === 1) {
      res.json({
        success: true,
        job: jobs[0]
      });
    } else {
      res.json({
        success: false,
        message: `pas de job ayant pour id ${id}`
      });
    }
  });

  app.use('/api', api);
  app.use('/auth', auth);





  app.use((req, res, next) => {
    console.warn(`${req.originalUrl} route not found on JsJobs server!`);
    next();
  });

  return app;
};
