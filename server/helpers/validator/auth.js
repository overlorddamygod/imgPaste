import joi from 'joi';
import { emailRule, passwordRule } from './index.js';

export const registerSchema = joi.object({
    email: emailRule,
    password: passwordRule,
    confirmPassword: joi.ref('password'),
})

export const loginSchema = joi.object({
    email: emailRule,
    password: passwordRule,
})