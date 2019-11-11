'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema({
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
});

module.exports = mongoose.model('Company', companySchema);
