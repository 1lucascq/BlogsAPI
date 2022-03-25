require('dotenv').config();
const jwt = require('jsonwebtoken');
const { User } = require('../../sequelize/models');
const UserService = require('../services/UserService');

const { JWT_SECRET: SECRET } = process.env;
const JWT_CONFIG = {
  expiresIn: '1d',
  algorithm: 'HS256',
};

const create = async (req, res) => {
  try {
    const { displayName, email, password, image } = req.body;
    const alreadyExists = await UserService.checkEmail(email);
    
    if (alreadyExists) return res.status(409).json({ message: 'User already registered' });

    const newUser = await User.create({ displayName, email, password, image });
    if (!newUser) {
      return res.status(400).json({ message: 'Falha na criação de usuário' });
    }
    const TOKEN = jwt.sign({ payload: { displayName, email, image } }, SECRET, JWT_CONFIG);

    return res.status(201).json({ token: TOKEN });
    } catch (e) {
      console.log(e.message);
      return res.status(500).json({ message: 'Erro na criação de usuário' });
    }
};

const findAll = async (_req, res) => {
  try {
    const allUsers = await User.findAll({ attributes: { exclude: ['password'] } });
    
    return res.status(200).json(allUsers);
  } catch (e) {
      console.log(e.message);
      return res.status(500).json({ message: 'Erro na requisição dos usuários' });
    }
};

const findByPk = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
    
    if (user === null) return res.status(404).json({ message: 'User does not exist' });
    
    return res.status(200).json(user);
  } catch (e) {
      console.log(e.message);
      return res.status(500).json({ message: 'Erro na requisição de um usuário' });
    }
};

const deleteMe = async (req, res) => {
  const { email } = req;
  const { dataValues: { id } } = await User.findOne({ where: { email } });
  await User.destroy({ where: { id } });
  return res.status(204).json({});
};

module.exports = { create, findAll, findByPk, deleteMe };