'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config/config');
let users = require('../../data/users').users;

exports.login = (req, res) => {
  console.log(`Req.body = ${req.body}`);
  if (req.body) {
    const email = req.body.email.toLocaleLowerCase();
    const password = req.body.password;

    const index = users.findIndex(user => user.email === email);

    let user;

    if ((index > -1) && (users[index].password === password)) {
      user = users[index];

      const token = jwt.sign({
        issuer: config.jwt.issuer,
        role: user.role,
        email: user.email,
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
  } else {
    res.status(500).json({
      success: false,
      message: 'données manquantes'
    });
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

    users = [user, ...users];

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
