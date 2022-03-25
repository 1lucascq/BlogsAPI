require('dotenv').config();
const jwt = require('jsonwebtoken');
const LoginService = require('../services/LoginService');

const { JWT_SECRET: SECRET } = process.env;
const JWT_CONFIG = {
  expiresIn: '1d',
  algorithm: 'HS256',
};

const log = async (req, res) => {
  try {
    const { email, password } = req.body;
    const checkUser = await LoginService.checkUser({ email, password });
    
    if (!checkUser) return res.status(400).json({ message: 'Invalid fields' });

    const TOKEN = jwt.sign({ payload: { email } }, SECRET, JWT_CONFIG);

    return res.status(200).json({ token: TOKEN });
    } catch (e) {
      // console.log(e);
      return res.status(500).json({ message: e.message });
    }
};

module.exports = { log };