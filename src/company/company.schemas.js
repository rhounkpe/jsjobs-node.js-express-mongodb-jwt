'use strict';
const mongoose = require('mongoose');
const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt'));

const Schema = mongoose.Schema;

/**
 *
 * @type {{LoginSchema}}
 */
const LoginSchema = new Schema({
  identityKey: {
    type: String,
    require: true,
    index: {
      unique: true
    }
  },
  failedAttempts: {
    type: Number,
    required: true,
    default: 0
  },
  timeout: {
    type: Date,
    required: true,
    default: new Date()
  },
  inProgress: {
    type: Boolean,
    default: false
  }
});

LoginSchema.static("canAuthenticate", async function (key) {
  const login = await this.findOne({identityKey: key});

  if (!login || login.failedAttempts < 5) {
    return true;
  }

  const timeout = (new Date() - new Date(login.timeout).addMinutes(1));
  if (timeout >= 0) {
    await login.deleteOne();
    return true;
  }
  return false;
});


/**
 * Adding new or updating existing login attempt.
 */
LoginSchema.static("failedLoginAttempt", async function (key) {
  const query = {identityKey: key};
  const update = {$inc: {failedAttempts: 1}, timeout: new Date(), inProgress: false};
  const options = {setDefaultsOnInsert: true, upsert: true};

  return await this.findOneAndUpdate(query, update, options).exec();
});

LoginSchema.static("successfulLoginAttempt", async function (key) {
  const login = await this.findOne({identityKey: key});

  if (login) {
    return await login.deleteOne();
  }
});

LoginSchema.static("inProgress", async function (key) {
  const login = await this.findOne({identityKey: key});
  const query = {identityKey: key};
  const update = {inProgress: true};
  const options = {setDefaultsOnInsert: true, upsert: true};
  return this.findOneAndUpdate(query, update, options).exec();
});


/**
 * AddressSchema
 */
const AddressSchema = new Schema(
  {
    type: {
      type: String
    },
    street: {
      type: String
    },
    city: {
      type: String
    },
    zipcode: {
      type: Number
    },
    state: {
      type: String
    },
    country: {
      type: String
    }
  },
  {
    _id: false
  }
);

const ContactSchema = new Schema({
  email: {
    type: String,
    required: true,
    match: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
  },
  url: {
    type: String,
  },
  tel: {
    type: String
  },
  fax: {
    type: String
  },
  gsm: {
    type: String
  }
});


/**
 * CompanySchema
 */
const CompanySchema = new Schema({
  name: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    match: /(?=.*[a-zA-Z])(?=.*[0-9]+)(?=.*[!*&^%$#@()+]+).*/,
  },
  description: {
    type: String,
  },
  address: AddressSchema,
  contact: [ContactSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  createdOn: {
    type: Date,
    default: Date.now()
  }
});

CompanySchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const hash = await bcrypt.hashSync(this.password, 16.5);

    this.password = hash;
    next();
  } catch (e) {
    next(e);
  }
});

CompanySchema.methods.passwordIsValid = async function (password) {
  try {
    return bcrypt.compareSync(password, this.password);
  } catch (e) {
    throw e;
  }
};

module.exports = {
  CompanySchema,
  LoginSchema,
};
