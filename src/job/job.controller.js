'use strict';

const { getJobModel } = require('./job.model.factory');


const allJobs = async () => {
  try {
    const Job = await getJobModel();

    await Job.find({}).sort().exec(async (err, jobs) => {
      if (err) return err;
      return jobs;
    });
  }catch (e) {
    throw e;
  }

};


exports.getAllJobs = async (req, res) => {
  try {
    const Job = await getJobModel();

    await Job.find({}).sort().exec(async (err, jobs) => {
      if (err) {
        return res.status(401).send({
          message: err.stack
        });
      }
      return res.status(200).send(jobs);
    });
  } catch (e) {
    throw e;
  }

};

exports.getAllJobsByUser = async (req, res) => {
  const email = req.params.email;

  try {
    const Job = await getJobModel();

    await Job.find({}).exec(async (err, jobs) => {
      if (err) return err;
      jobs.filter(job => job.email === email);

      res.status(200).json({
        success: true,
        jobs,
      });
    });
  } catch (e) {
    throw e;
  }
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
