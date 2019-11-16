'use strict';

const { getUserModel } = require('../user/user.model.factory');

exports.getAllUsers = async (req, res) => {
  try {
    const pageSize = 50;
    const { page } = req.query;
    const skip = page > 1 ? page * 50 : 0;
    const User = await getUserModel();
    const totalUsers = await User.count();
    const totalPages = Math.floor((totalUsers + pageSize - 1) / pageSize);

    const users = await User.find({}, {skip: skip, limit: 50}) || [];

    return res.json({
      users,
      totalPages,
    });
  } catch (err) {
    return res.status(500).send('There was an error retrieving the list of all users');
  }
};


exports.deleteSingleUser = async (req, res) => {
  try {
    const {email} = req.body;
    const User = await getUserModel();
    const user = await User.findOne({ email: email });

    if (user) {
      await User.deleteOne({ email: email });
      return res.sendStatus(200);
    } else {
      return res.status(404).send('The requested user does not exists.');
    }
  } catch (err) {
    return res.status(500).send('There was an error attempting to remove user');
  }
};
