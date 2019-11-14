'use strict';
const mongoose = require('mongoose');
const Promise = require('bluebird');
const Schema = mongoose.Schema;

const JobSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  comp: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    require: false,
  },
  company: {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    url: {
      type: String,
    },
    address: {
      street: {
        type: String
      },
      city: {
        type: String
      },
      zipcode: {
        type: String
      },
    },
    description: {
      type: String,
    },
  },
  description: {
    type: String
  },
  contract: {
    type: String
  },
  salary: {
    amount: {
      type: Number
    },
    currency: {
      type: String
    },
  },
  experience: {
    type: String
  },
  status: {
    type: String
  },
  area: {
    type: String
  },
  field: {
    type: String
  },
  startdate: {
    type: Date
  },
  publishdate: {
    type: Date,
    default: Date.now,
    required: true
  },
  lastupdate: {
    type: Date,
    default: Date.now,
    required: true
  },
});

module.exports = {
  JobSchema,
};
