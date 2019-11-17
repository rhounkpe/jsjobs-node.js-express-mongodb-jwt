'use strict';

const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const { getCompanyModel, getLoginModel } = require('./company.model.factory');


/**
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */
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

    if (errors.length > 0) {
      return delayResponse(() => res.status(401).send('Invalid username or password'));
    }

    const identityKey = `${email}-${clientIp}`;
    const Login = await getLoginModel();

    // Brute Force Attack in parallel
    if (await Login.inProgress(identityKey)) {
      return delayResponse(() => res.status(500).send('Login already in progress.'));
    }


    if (!(await Login.canAuthenticate(identityKey))) {
      return delayResponse(() => res.status(500).send('The account is temporarily locked out.'));
    }

    const existingCompany = await Company.findOne({email: email}).exec();

    if (existingCompany) {

      if (await existingCompany.passwordIsValid(password)) {
        const token = jwt.sign({
          iss: config.jwt.issuer,
          role: existingCompany.role,
          email: existingCompany.email,
          companyId: existingCompany.id,
        }, config.jwt.secret);

        const companyInfo = {
          _id: existingCompany._id,
          email: existingCompany.email,
          nickname: existingCompany.nickname,
          token
        };

        req.session.login(companyInfo, function (err) {
          if (err) {
            return res.status(500).send('There was an error logging in. Please try again later.');
          }
        });

        await Login.successfulLoginAttempt(identityKey);

        return delayResponse(() => res.status(200).json({
          company: existingCompany,
          token,
        }));
      } else {
        // Email is good, so we have an issue with the password
        await Login.failedLoginAttempt(identityKey);
        return delayResponse(() => res.status(401).send(`Invalid password for company with email address: ${email}`));
      }

    } else {
      // We don't have a user with this email. So no company for this email.
      await Login.failedLoginAttempt(identityKey);
      return delayResponse(() => res.status(401).send(`Invalid email. We do not find a company with email address: ${email}`));
    }

  } catch (err) {
    return delayResponse(() => res.status(500).send('There was an error attempting to login. Please try again later.'));
  }
};


/**
 *
 * @param req
 * @param res
 * @return {Promise<*|Promise<any>>}
 */
exports.register = async (req, res) => {
  console.log(`req.body = ${JSON.stringify(req.body)}`);
  try {
    const Company = await getCompanyModel();


    let name;
    let email;
    let password;

    if (req.body) {
      if (req.body.name) {
        name = req.body.name;

        if (name) {
          name = name.trim();
        }
      }

      if (req.body.contact) {
        email = req.body.contact.email;

        if (email) {
          email = email.trim();
        }
      }

      password = req.body.password;
      if (password) {
        password = password.trim();
      }


      const submittedCompany = {
        name,
        email,
        password,
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

      return res.status(201).json(company);

    } else {
      return res.json({
        success: false,
        message: 'Echec de la création de une nouvelle compagnie',
      });
    }

  } catch (e) {
    console.error(`An error happened when creating a new company: ${e.stack}`);
  }

};


/**
 *
 * @param req
 * @param res
 * @return {Promise<any>}
 */
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

