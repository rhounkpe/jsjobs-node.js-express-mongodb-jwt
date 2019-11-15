'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config/config');

const {check, validationResult, checkSchema} = require('express-validator');

const {getCompanyModel, getLoginModel} = require('./company.model.factory');
const {companyRegistrationSchema} = require('./company.validation.schemas');


exports.login = async (req, res) => {
  // Against Brute Force Attack
  const delayResponse = response => {
    setTimeout(() => {
      response();
    }, 1000);
  };

  try {
    const Company = await getCompanyModel();

    const {clientIp} = req;
    const {email, password} = req.body;

    // req.checkBody(loginSchema)
    // const errors = req.validationErrors();
    const errors = [];

    /*    if(errors) {
          return delayResponse(() => res.status(401).send('Invalid username or password'));
        }*/

    const identityKey = `${email}-${clientIp}`;
    const Login = await getLoginModel();

    // Brute Force Attack in parallel
    if (await Login.inProgress(identityKey)) {
      return delayResponse(() => res.status(500).send('Login already in progress.'));
    }

    if (!(await Login.canAuthenticate(identityKey))) {
      return delayResponse(() => res.status(500).send('The account is temporarily locked out.'));
    }


    Company.findOne({email: email}).exec(async (err, existingCompany) => {
      if (err) {
        console.log(`Error while authenticated: ${err}`);
        await Login.failedLoginAttempt(identityKey);

        return delayResponse(() => res.status(401).send('Invalid email or password for a company'));
      }
      if (await existingCompany.passwordIsValid(password)) {
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

        await Login.successfulLoginAttempt(identityKey);

        return delayResponse(() => res.status(200).json({
          company: existingCompany,
          token,
        }));
      }

    });

  } catch (err) {
    return delayResponse(() => res.status(500).send('There is a problem logging in at the moment. Please try again later.'));
  }
};


const errorFormatter = ({location, msg, param, value, nestedErrors}) => {
  // Build your resulting errors however you want! String, object, whatever - it works!
  return `${location}[${param}]: ${msg}`;
};

exports.register = async (req, res) => {
  try {
    const Company = await getCompanyModel();

    checkSchema(companyRegistrationSchema);
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(500).json(`There is an error: ${errors.array()}`);
    }

    if (req.body) {
      const email = req.body.email.trim();
      const password = req.body.password.trim();
      const nickname = req.body.nickname.trim();

      const submittedCompany = {
        name: nickname,
        email: email,
        password: password
      };

      const company = new Company(submittedCompany);

      await company.save()
        .then(function (company) {
          if (company) {
            console.log(`Company newly created: ${JSON.stringify(company)}`);
          }
        })
        .catch(function (err) {
          console.error(`An error happened when creating new comapany: ${err.stack}`);
          return res.status(400).send({message: `Error: ${err.stack}`});
        });

      res.status(201).json(company);

    } else {
      res.json({
        success: false,
        message: 'Echec de la création de une nouvelle compagnie',
      });
    }

  } catch (e) {
    console.error(`An error happened when creating a new company: ${e.stack}`);
  }

};

exports.logout = (req, res) => {
  return new Promise((resolve, reject) => {
    try {
      if (req.session) {
        req.session.destroy();
        resolve(res.sendStatus(200));
      }
    } catch (e) {
      return reject(res.sendStatus(500));
    }
  });
};

