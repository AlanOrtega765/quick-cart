import Joi from 'joi';

export const useJoiSchemes = () => {
  const loginScheme = Joi.object({
    email: Joi.string()
      .email({
        tlds: {
          allow: false,
        },
      })
      .required()
      .messages({
        'string.email': 'Debes ingresar un correo electrónico válido.',
        'string.empty': 'Debes ingresar un correo electrónico.',
      }),
    password: Joi.string().min(6).required().messages({
      'string.empty': 'Debes ingresar una contraseña.',
      'string.min': 'La contraseña debe contener mínimo {#limit} caracteres.',
    }),
  });

  const registerScheme = Joi.object({
    email: Joi.string()
      .email({
        tlds: {
          allow: false,
        },
      })
      .required()
      .messages({
        'string.email': 'Debes ingresar un correo electrónico válido.',
        'string.empty': 'Debes ingresar un correo electrónico.',
      }),
    password: Joi.string().min(8).required().messages({
      'string.empty': 'Debes ingresar una contraseña.',
      'string.min': 'La contraseña debe contener mínimo {#limit} caracteres.',
    }),
  });

  return { loginScheme, registerScheme };
};
