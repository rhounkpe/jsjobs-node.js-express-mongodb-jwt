const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { getUserModel } = require('../user/user.model.factory');
const RBAC = require('../libs/role.based.access.control');

exports.checkUserToken = (req, res, next) => {
  if (!req.header('authorization')) return res.status(401).json({ success: false, message: 'Not authorized' });

  console.info(`req.header.authorization = ${req.header('authorization')}`);

  const authorizationParts = req.header('authorization').split(' ');
  const token = authorizationParts[1];

  jwt.verify(token, config.jwt.secret, (err, decodedToken) => {
    if (err) {
      console.error(err);
      return res.status(401).json({ success: false, message: 'Token non valide' });
    } else {
      console.log(`decoded token = ${JSON.stringify(decodedToken)}`);
      next();
    }
  });
};

async function getUserFromSession(sessionData) {
  const User = await getUserModel();
  const {
    userInfo = {}
  } = sessionData;

  return await User.findOne({ _id: userInfo.id });
};


exports.isAdminAndCanListAllUsers = async (req, res, next) => {
  try {
    const user = await getUserFromSession(req.session);

    RBAC.prototype.check(user).is('admin').can('list users', (err, results) => {
      if (!results) {
        return res.status(401).send('Not authorized to list all users!');
      }
      next();
    });
  } catch (err) {
    return res.status(500).send(`There was an error attempting to list all users.\n ${err.stack}`);
  }
};


exports.isAdminAndCanRemoveUsers = async (req, res, next) => {
  try {
    const user = await getUserFromSession(req.session);
    RBAC.check(user).is('admin').can('remove user', (err, results) => {
      if (!results) {
        return res.status(401).send('Not authorized to remove a user!');
      }
      next();
    });
  } catch (err) {
    return res.status(500).send(`There was an error attempting to remove a user.\n ${err.stack}`);
  }
};
