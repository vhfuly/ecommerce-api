import Joi from 'joi';

const UserValidation = {
  login: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    })
  }
}

export { UserValidation }
