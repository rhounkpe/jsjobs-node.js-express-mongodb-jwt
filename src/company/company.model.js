/*
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { LoginSchema } = require('./company.schemas')

const bcrypt = require('bcrypt');

const CompanySchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true
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
    required: true,
    match: /(?=.*[a-zA-Z])(?=.*[0-9]+)(?=.*[!*&^%$#@()+]+).*!/,
  },
  description: {
    type: String,
  },
});

CompanySchema.pre("save", function(next) {
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

CompanySchema.methods.passwordIsValid = function(password, callback) {
  bcrypt.compare(password, this.password, function(err, results) {
    if (err) {
      callback(false);
      return;
    }
    callback(null, results);
  });
};

const Company = mongoose.model('Company', CompanySchema);

const LoginSchema = mongoose.model('LoginSchema', LoginSchema);

module.exports = {
  CompanySchema,
  Company,
  Login: LoginSchema
};
*/
