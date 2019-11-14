'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config/config');

const { Company, companySchema} = require('../company/company.model');

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

exports.register = (req, res) => {
  if (req.body) {
    const email = req.body.email.trim();
    const password = req.body.password.trim();
    const nickname = req.body.nickname.trim();

    const company = new Company({
      name: nickname,
      email: email,
      password: password
    });

    company.save((err, comp) => {
      if (err) {
        return res.status(400).send({
          message: `Error: ${err.stack}`
        });
      } else {
        res.json({
          success: true,
          company: comp
        });
      }
    });
  } else {
    res.json({
      success: false,
      message: 'Echec de la création de une nouvelle compagnie',
    });
  }
};

