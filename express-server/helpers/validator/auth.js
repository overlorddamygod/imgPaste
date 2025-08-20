import joi from 'joi';
import { emailRule, passwordRule } from './index.js';

export const registerSchema = joi.object({
    username: joi.string().min(3).max(30).required(),
    email: emailRule,
    password: passwordRule,
    confirmPassword: joi.ref('password'),
})

export const loginSchema = joi.object({
    email: emailRule,
    password: passwordRule,
})