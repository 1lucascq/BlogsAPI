require('dotenv').config();
const { Op } = require('sequelize');
// const { Op } = require('@sequelize/core');   //Isso é da versão 7 alpha, não sei comofas sem isso

const { BlogPost, User, Category } = require('../../sequelize/models');
const PostsService = require('../services/PostsService');

const create = async (req, res) => {
  try {
    const { title, content, categoryIds } = req.body;
    const { email } = req;
    const { dataValues: { id } } = await User.findOne({ where: { email } });

    const isValid = await PostsService.checkCategory(categoryIds);
    
    if (!isValid) return res.status(400).json({ message: '"categoryIds" not found' });
    
    const newPost = await BlogPost.create({ title, content, categoryIds, userId: id });

    return res.status(201).json(newPost);
    } catch (e) {
      console.log(e.message);
      return res.status(500).json({ message: 'Erro na criação de um post' });
    }
};

const findAll = async (_req, res) => {
  try {
    const allPosts = await BlogPost.findAll({
      include: [
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
        { model: Category, as: 'categories', through: { attributes: [] } },
      ] });
    
    return res.status(200).json(allPosts);
  } catch (e) {
      console.log(e.message);
      return res.status(500).json({ message: 'Erro na requisição dos posts' });
    }
};

const findByPk = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await BlogPost.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
        { model: Category, as: 'categories', through: { attributes: [] } },
      ] });
    
    if (post === null) return res.status(404).json({ message: 'Post does not exist' });
    
    return res.status(200).json(post);
  } catch (e) {
      console.log(e.message);
      return res.status(500).json({ message: 'Erro na requisição de um post' });
    }
};

const updateByPk = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const isAllowed = await PostsService.checkUser({ email: req.email, id });
    if (req.body.categoryIds) {
      return res.status(400).json({ message: 'Categories cannot be edited' });
    }
    if (!isAllowed) {
      return res.status(401).json({ message: 'Unauthorized user' });
    }
    await BlogPost.update({ title, content }, { where: { id } });
    const updatedPost = await BlogPost.findByPk(id, { include:
      { model: Category, as: 'categories', through: { attributes: [] } } });
    return res.status(200).json(updatedPost);
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: 'Erro na atualização de um post' });  
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    
    const isAllowed = await PostsService.checkUser({ email: req.email, id });
    if (isAllowed === 404) return res.status(404).json({ message: 'Post does not exist' });
    if (!isAllowed) {
      return res.status(401).json({ message: 'Unauthorized user' });
    }
    await BlogPost.destroy({ where: { id } });
    return res.status(204).json();
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: 'Erro na deleção de um post' });
  }
};

const findWithQuery = async (req, res) => {
  try {
    const { q } = req.query;
    console.log(q);
    const posts = await BlogPost.findAll({
      where: { [Op.or]:
        [{ title: { [Op.like]: `%${q}%` } },
        { content: { [Op.like]: `%${q}%` } }] },
      include: [
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
        { model: Category, as: 'categories', through: { attributes: [] } },
      ],
    });
    return res.status(200).json(posts);
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: 'Erro ao realizar a busca' });
  }
};

module.exports = { create, findAll, findByPk, updateByPk, deletePost, findWithQuery };