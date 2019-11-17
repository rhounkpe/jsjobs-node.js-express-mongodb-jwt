'use strict';

const { body } = require('express-validator');


exports.companyValidationRules = () => {
  return [
    body('email').isEmail().normalizeEmail(),
    body('url').isURL(),
    body('tel').isLength({max: 12}),
    body('fax').isLength({max: 12}),
    body('gsm').isMobilePhone(),
    body('password').isLength({min: 8}),
    body('tel').isLength({min: 12}),
  ];
};
