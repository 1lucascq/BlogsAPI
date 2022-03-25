const express = require('express');
const UserController = require('../controllers/UserController');
const LoginController = require('../controllers/LoginController');
const CategoriesController = require('../controllers/CategoriesController');
const PostsController = require('../controllers/PostsController');
const { checkToken } = require('../middlewares/Auth');
const { checkUserData } = require('../middlewares/UserValidation');
const { checkLoginData } = require('../middlewares/LoginValidation');
const { checkCategoryData } = require('../middlewares/CategoriesValidation');
const { checkPostData, checkEditFields } = require('../middlewares/PostsValidation');

const router = express.Router();

router.post('/user', checkUserData, UserController.create);
router.get('/user', checkToken, UserController.findAll);
router.get('/user/:id', checkToken, UserController.findByPk);
router.post('/login', checkLoginData, LoginController.log);
router.post('/categories', checkCategoryData, checkToken, CategoriesController.create);
router.get('/categories', checkToken, CategoriesController.findAll);
router.post('/post', checkPostData, checkToken, PostsController.create);
router.get('/post', checkToken, PostsController.findAll);
router.get('/post/search', checkToken, PostsController.findWithQuery);
router.get('/post/:id', checkToken, PostsController.findByPk);
router.put('/post/:id', checkEditFields, checkToken, PostsController.updateByPk);
router.delete('/post/:id', checkToken, PostsController.deletePost);
router.delete('/user/me', checkToken, UserController.deleteMe);

module.exports = router;