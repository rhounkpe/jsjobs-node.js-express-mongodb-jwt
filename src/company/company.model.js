'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt');

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
  password: {
    type: String,
  },
  description: {
    type: String,
  },
});

companySchema.pre("save", function(next) {
  if (!this.isModified("password")) {
    return next();
  }

  bcrypt.hash(this.password, 16.5, (err, hash) => {
    if (err) {
      next(err);
      return;
    }
    this.password = hash;
    next();
  })
});

companySchema.methods.passwordIsValid = function(password, callback) {
  bcrypt.compare(password, this.password, function(err, results) {
    if (err) {
      callback(false);
      return;
    }
    callback(null, results);
  });
};

const Company = mongoose.model('Company', companySchema);

module.exports = {
  companySchema,
  Company
};
