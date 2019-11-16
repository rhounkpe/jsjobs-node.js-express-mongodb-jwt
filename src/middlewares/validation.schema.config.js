'use strict';

const { validationResult, checkSchema } = require('express-validator');

const {companyRegistrationSchema} = require('../company/company.validation.schemas');

exports.validationSchemaConfig = function (req, res, next) {
  if (req.url != '/api/company/auth/register') {
    next();
  } else {
    checkSchema(companyRegistrationSchema);

    const errors = validationResult(req).formatWith(errorFormatter);

    if (!errors.isEmpty()) {
      return res.status(500).json(errors.array());
    }

    next();
  }
};
