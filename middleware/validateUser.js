const Joi = require("joi");

function validateUser(req, res, next) {
  const schema = Joi.object({
    username: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    code: Joi.string().min(8).max(8).required(),
    password: Joi.string().min(8).max(30).required(),
  });

  const result = schema.validate(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  next();
}

module.exports = validateUser;
