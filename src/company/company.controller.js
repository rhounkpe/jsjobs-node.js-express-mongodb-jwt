'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config/config');

const Company = require('../company/company.model');

exports.login = (req, res) => {

  if (req.body) {
    const email = req.body.email.trim();
    const password = req.body.password.trim();

    let company;
    Company.findOne({email: email}).exec((err, comp) => {
      if (err) return err;

      company = comp;
      if (company && company.password === password) {
        const token = jwt.sign({
          iss: config.jwt.issuer,
          role: company.role,
          email: company.email,
          companyId: company.id,
        }, config.jwt.secret);

        res.status(200).json({
          success: true,
          token,
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'identifiant incorrects'
        });
      }
    });

  } else {
    res.status(500).json({
      success: false,
      message: 'données manquantes'
    });
  }
};
