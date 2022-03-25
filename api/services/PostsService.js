const { User, Category, BlogPost } = require('../../sequelize/models');

const checkCategory = async (categoryIds) => {
  const checkCategories = await Promise.all(categoryIds.map(async (id) => {
    const category = await Category.findByPk(id);
    if (!category) return false;
    return true;
  }));
  
  return checkCategories.every((el) => el === true);
};

const checkUser = async ({ email, id }) => {
  const post = await BlogPost.findByPk(id);
  if (!post) return 404;
  const { dataValues } = await User.findOne({ where: { email } });
  if (post.dataValues.userId !== dataValues.id) {
    return false;
  }
  
  return true;
};

module.exports = { checkCategory, checkUser };