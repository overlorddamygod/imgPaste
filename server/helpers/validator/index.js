import joi from "joi";

export const emailRule = joi.string().email();
export const passwordRule = joi.string().min(6).pattern(new RegExp('^[a-zA-Z0-9]{6,}$'));
