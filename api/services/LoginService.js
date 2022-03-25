const { User } = require('../../sequelize/models');

const checkUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) return false;

  const { dataValues } = user;
  if (dataValues.email !== email || dataValues.password !== password) return false;
  return true;
};
// const checkUser = async (email) => {
//   return await User.findOne({ where: { email } }); 
// };

module.exports = { checkUser };