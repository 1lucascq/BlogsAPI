const Joi = require('joi');

const checkFields = (req, res, next) => {
  const { email, password } = req.body;
  
  const { error } = Joi.object({
    email: Joi.string().email().not().empty()
      .required(),
    password: Joi.string().not().empty().required(),
  }).validate({ email, password });
  
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};

const checkLoginData = [checkFields];

module.exports = { checkLoginData };
