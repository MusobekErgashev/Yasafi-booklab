const Joi = require('joi')

class AuthValidate {
    register = Joi.object({
        first_name: Joi.string().max(50).required().empty(' ').messages({
            'string.empty': 'Ism kiritish majburiy',
            'string.max': 'Ism 50 belgidan oshmasligi kerak',
            'any.required': 'Ism kiritish majburiy',
        }),
        last_name: Joi.string().max(50).required().empty(' ').messages({
            'string.empty': 'Familya kiritish majburiy',
            'string.max': 'Familya 50 belgidan oshmasligi kerak',
            'any.required': 'Familya kiritish majburiy',
        }),
        phone: Joi.string().required().empty(' ').messages({
            'string.empty': 'Telefon raqami kiritish majburiy',
            'any.required': 'Telefon raqami kiritish majburiy',
        }),
        login: Joi.string().min(5).max(25).required().empty(' ').messages({
            'string.empty': 'Login kiritish majburiy',
            'string.min': 'Login 5 belgidan kam bo`lmasligi kerak',
            'string.max': 'Login 25 belgidan oshmasligi kerak',
            'any.required': 'Login kiritish majburiy',
        }),
        password: Joi.string().min(6).max(50).required().empty(' ').messages({
            'string.empty': 'Parol kiriritsh majburiy',
            'string.min': 'Parol 6 belgidan kam bo`lmasligi kerak',
            'string.max': 'Parol 50 belgidan oshmasligi kerak',
            'any.required': 'Parol kiritish majburiy',
        }),
        is_admin: Joi.boolean().default(false),
    });

    login = Joi.object({
        login: Joi.string().min(5).max(25).required().empty(' ').messages({
            'string.empty': 'Login kiritish majburiy',
            'string.min': 'Login 5 belgidan kam bo`lmasligi kerak',
            'string.max': 'Login 25 belgidan oshmasligi kerak',
            'any.required': 'Login kiritish majburiy',
        }),
        password: Joi.string().min(6).max(50).required().empty(' ').messages({
            'string.empty': 'Parol kiriritsh majburiy',
            'string.min': 'Parol 6 belgidan kam bo`lmasligi kerak',
            'string.max': 'Parol 50 belgidan oshmasligi kerak',
            'any.required': 'Parol kiritish majburiy',
        }),
    });

    updateCusomer = Joi.object({
        first_name: Joi.string().allow('').max(50).messages({
            'string.max': 'Ism 50 belgidan oshmasligi kerak',
        }),
        last_name: Joi.string().allow('').max(50).messages({
            'string.max': 'Familya 50 belgidan oshmasligi kerak',
        }),
        phone: Joi.string().allow('').max(20).messages({
            'string.max': 'Telefon raqami 20 belgidan oshmasligi kerak',
        }),
        login: Joi.string().min(5).max(25).allow('').messages({
            'string.min': 'Login 5 belgidan kam bo`lmasligi kerak',
            'string.max': 'Login 25 belgidan oshmasligi kerak',
        }),
        password: Joi.string().min(6).max(50).allow('').messages({
            'string.min': 'Parol 6 belgidan kam bo`lmasligi kerak',
            'string.max': 'Parol 50 belgidan oshmasligi kerak',
        }),
    });
}

module.exports = new AuthValidate();