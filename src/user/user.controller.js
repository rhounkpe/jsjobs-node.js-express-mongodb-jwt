'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { getUserModel } = require('./user.model.factory');


exports.login = async (req, res) => {
  try {
    const User = await getUserModel();

    if (req.body) {
      const email = req.body.email.trim();
      const password = req.body.password.trim();



      let user;
      User.findOne({email: email}).exec((err, u) => {
        if (err) return err;

        user = u;
        if (user && user.password === password) {
          const token = jwt.sign({
            iss: config.jwt.issuer,
            role: user.role,
            email: user.email,
            companyId: user.id,
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
  } catch (err) {
    return res.status(500).send(`There was an error attempting to login in.\n${err}`);
  }

};


exports.register = (req, res) => {
  console.log('req.body: ', req.body);
  if (req.body) {
    const email = req.body.email.trim();
    const password = req.body.password.trim();
    const nickname = req.body.nickname.trim();
    const user = {
      id: Date.now(),
      email,
      nickname,
      password,
    };

    //users = [user, ...users];

    res.json({
      success: true,
      user,
      users,
    });
  } else {
    res.json({
      success: false,
      message: 'Echec de la création de un nouvel utilisateur',
    });
  }
};
