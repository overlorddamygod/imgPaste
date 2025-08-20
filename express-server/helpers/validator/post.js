import joi from 'joi';

export const addPostItemSchema = joi.object({
    id: joi.string().required(),
    type: joi.string().required(),
    content: joi.string()
});