require('dotenv').config();
const { Category } = require('../../sequelize/models');

const create = async (req, res) => {
  try {
    const { name } = req.body;

    const newCategory = await Category.create({ name });
    if (!newCategory) {
      return res.status(400).json({ message: 'Falha na criação de categoria' });
    }
    return res.status(201).json(newCategory);
    } catch (e) {
      console.log(e.message);
      return res.status(500).json({ message: 'Erro na criação de uma categoria' });
    }
};

const findAll = async (_req, res) => {
  try {
    const categories = await Category.findAll();
    
    return res.status(200).json(categories);
  } catch (e) {
      console.log(e.message);
      return res.status(500).json({ message: 'Erro na requisição das categorias' });
    }
};

module.exports = { create, findAll };