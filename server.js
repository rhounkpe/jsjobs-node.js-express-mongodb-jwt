const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var cors = require('cors')
const jwt = require('jsonwebtoken');

let data = require('./data/jobs');
let initialJobs = data.jobs;
let addedJobs = [];

const getAllJobs = () => {
  return [...addedJobs, ...initialJobs];
};


users = [];

const rufin = {
  id: 1,
  email: 'rhounkpe@yahoo.fr',
  nickname: 'rhounkpe',
  password: 'Pa$$w0rd',
  role: 'admin',
};

const dominique = {
  id: 1,
  email: 'dominique@yahoo.fr',
  nickname: 'dominique',
  password: 'Pa$$w0rd',
  role: 'manager',
};

const arno = {
  id: 1,
  email: 'arno@yahoo.fr',
  nickname: 'arno',
  password: 'Pa$$w0rd',
  role: 'user',
};

users.push(rufin, dominique, arno);

const secret = '$!7;~}d32"Z;-^`TchH*Am6Lzge}7/)(vV2S_tNj?g+/T2NFTKP$FnZ3>LG9`^-[~-S?pLL4&)ZVP(<55k,r/`Wp&w<rv8}Lcp_$7H4+ae`a%{hTz66UdDTS:c]vLJ?`B<Y?@Gmm';

// app.use(bodyParser({extended: true}))
app.use(bodyParser.json());

app.use(cors());
/*app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});*/

const api = express.Router();

const auth = express.Router();

auth.post('/login', (req, res) => {
  if (req.body) {
    const email = req.body.email.toLocaleLowerCase();
    const password = req.body.password;

    const index = users.findIndex(user => user.email === email);

    let user;

    if ((index > -1) && (users[index].password === password)) {
      user = users[index];

      const token = jwt.sign({
        issuer: 'http://localhost:4201',
        role: user.role,
        email: user.email,
      }, secret);
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

const checkUserToken = (req, res, next) => {
  if (!req.header('authorization')) return res.status(401).json({ success: false, message: 'Not authorized' });

  console.info(`req.header.authorization = ${req.header('authorization')}`);

  const authorizationParts = req.header('authorization').split(' ');
  const token = authorizationParts[1];

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      console.error(err);
      return res.status(401).json({ success: false, message: 'Token non valide' });
    } else {
      console.log(`decoded token = ${JSON.stringify(decodedToken)}`);
      next();
    }
  });
};

api.get('/jobs', (req, res) => {
  res.json(getAllJobs());
});

api.get('/jobs/:email', (req, res) => {
  const email = req.params.email;

  // const jobs = getAllJobs().filter(job => (job.email === email));
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
app.use('/auth', auth)

const port = 4201;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

