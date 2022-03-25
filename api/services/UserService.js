const { User } = require('../../sequelize/models');

const checkEmail = async (email) => User.findOne({ where: { email } });

module.exports = { checkEmail };