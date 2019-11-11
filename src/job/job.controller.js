'use strict';

const Job = require('./job.model');



const allJobs = () => {
  Job.find({}).sort().exec((err, jobs) => {
    if (err) return err;
    return jobs;
  });
};


exports.getAllJobs = (req, res) => {
  Job.find({}).sort().exec((err, jobs) => {
    if (err) {
      res.status(400).send({
        message: err.stack
      });
    }
    res.status(200).send(jobs);
  });
};

exports.getAllJobsByUser = (req, res) => {
  const email = req.params.email;


  const jobs = Job.find({}).exec((err, jobs) => {
    if (err) return err;
    return jobs.filter(job => job.email === email)
  });

  res.status(200).json({
    success: true,
    jobs,
  });
};

exports.getJobById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const jobs = allJobs().filter(j => j.id === id);

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
  const job = new Job(req.body);

  job.save((err) => {
    if (err) {
      return res.status(400).send({
        message: console.error(err)
      });
    }
    res.json(job);
  });
};


exports.search = (req, res) => {
  const term = req.params.term.toLowerCase().trim();

  let place = req.params.place;

  let jobs = allJobs().filter(
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
