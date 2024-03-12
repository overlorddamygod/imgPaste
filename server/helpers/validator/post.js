import joi from 'joi';

export const addPostItemSchema = joi.object({
    id: joi.number().required(),
    type: joi.string().required(),
    content: joi.string()
});