const Joi = require('joi');

const checkFields = (req, res, next) => {
  const { title, content, categoryIds } = req.body;
  
  const { error } = Joi.object({
    title: Joi.string().not().empty().required(),
    content: Joi.string().not().empty().required(),
    categoryIds: Joi.array().not().empty().required(),
  }).validate({ title, content, categoryIds });
  
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};

const checkEditFields = (req, res, next) => {
  const { title, content } = req.body;
  
  const { error } = Joi.object({
    title: Joi.string().not().empty().required(),
    content: Joi.string().not().empty().required(),
  }).validate({ title, content });
  
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};

const checkPostData = [checkFields];

module.exports = { checkPostData, checkEditFields };
