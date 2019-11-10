'use strict';
let data = require('../../data/jobs');
let initialJobs = data.jobs;
let addedJobs = [];

const getAllJobs = () => {
  return [...addedJobs, ...initialJobs];
};

exports.getAllJobs = (req, res) => {

  res.json(getAllJobs());
};

exports.getAllJobsByUser = (req, res) => {
  const email = req.params.email;
  const jobs = getAllJobs().filter(job => job.email === email);

  res.status(200).json({
    success: true,
    jobs,
  });
};

exports.getJobById = (req, res) => {
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
};

exports.create = (req, res) => {
  const job = req.body;
  console.log(job);
  addedJobs = [job, ...addedJobs];
  console.log('total number of jobs: ', getAllJobs().length);
  res.json(job);
};


exports.search = (req, res) => {
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
};
