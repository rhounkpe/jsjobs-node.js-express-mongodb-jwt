const checkUserToken = (req, res, next) => {
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

module.exports = {
  checkUserToken,
};
