'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config/config');

const {Company, companySchema} = require('../company/company.model');

exports.login = async (req, res) => {
  try {
    //const Company = await getCompanyModel();
    const { email, password } = req.body;
    await Company.findOne({email: email}).exec((err, existingCompany) => {
      if (err) {
        return res.status(401).send('Invalid email or password for a company');
      } else {
        existingCompany.passwordIsValid(password, function (err, results) {
          if (err) {
            return res.status(500).send('N° 1 | There is a problem logging in at the moment. Please try again later.');
          } else if (!results) {
            return res.status(401).send('Invalid email or password');
          }

          const companyInfo = {
            _id: existingCompany._id,
            email: existingCompany.email,
            nickname: existingCompany.nickname
          };

          // req.session.login(companyInfo);
          const token = jwt.sign({
            iss: config.jwt.issuer,
            role: existingCompany.role,
            email: existingCompany.email,
            companyId: existingCompany.id,
          }, config.jwt.secret);

          return res.status(200).json({
            company: existingCompany,
            token,
          });
        });
      }
    });

  } catch (err) {
    return res.status(500).send('There is a problem logging in at the moment. Please try again later.');
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

