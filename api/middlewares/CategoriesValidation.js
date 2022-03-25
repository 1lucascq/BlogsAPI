const Joi = require('joi');

const checkFields = (req, res, next) => {
  const { name } = req.body;
  
  const { error } = Joi.object({
    name: Joi.string().not().empty().required(),
  }).validate({ name });
  
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};

const checkCategoryData = [checkFields];

module.exports = { checkCategoryData };
