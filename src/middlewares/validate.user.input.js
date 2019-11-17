'use strict';

const { validationResult, matchedData } = require('express-validator');

exports.validate = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      req.matchedData = matchedData(req);
      return next();
    }


    const extractedErrors = [];
    errors.array().map(error => extractedErrors.push({
      [error.param]: error.msg,
    }));

    return res.status(422).json({errors: extractedErrors});
  } catch (err) {
    throw err;
  }
};
