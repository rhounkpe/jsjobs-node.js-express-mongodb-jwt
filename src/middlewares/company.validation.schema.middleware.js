'use strict';

const { validationResult, check } = require('express-validator');

const {companyRegistrationSchema} = require('../company/company.validation.schemas');
const { companyValidationRules } = require('../company/company.validation.rules');

exports.companyValidationSchemaMiddleware = function (req, res, next) {
  console.log('Validation middleware starts...');

  /*
   * We make sure that the incomming request is from our API.
   * We can then let the Schema validate data
   */
  if (req.url !== '/api/company/auth/register') {
    next();
  } else {
    // Request comes from another source. Let's validate it before accepting it.

    //companyValidationRules();
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      });
    }

    next();
  }
};
// TODO: Define errorFormatter function
//.formatWith(errorFormatter)
