const Joi = require('joi');

const checkFields = (req, res, next) => {
  const { displayName, email, password, image } = req.body;
  
  const { error } = Joi.object({
    displayName: Joi.string().not().empty().required(),
    email: Joi.string().email().not().empty()
      .required(),
    password: Joi.string().not().empty().required(),
    image: Joi.string().not().empty().required(),
  }).validate({ displayName, email, password, image });
  
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};

const checkLength = (req, res, next) => {
  const { displayName, password } = req.body;
  
  const { error } = Joi.object({
    displayName: Joi.string().min(8).required(),
    password: Joi.string().length(6).required(),
  }).validate({ displayName, password });
  
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const checkUserData = [checkFields, checkLength];

module.exports = { checkUserData };
