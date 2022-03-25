require('dotenv').config();
const jwt = require('jsonwebtoken');

const { JWT_SECRET: SECRET } = process.env;

const checkToken = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({ message: 'Token not found' });
    const { payload } = jwt.verify(authorization, SECRET);
    req.email = payload.email;
  } catch (e) {
    console.log(e.message);
    return res.status(401).json({ message: 'Expired or invalid token' });
  }
  next();
};

module.exports = { checkToken };
