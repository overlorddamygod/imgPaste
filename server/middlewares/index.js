import joi from 'joi';
import jsonwebtoken from "jsonwebtoken"
import { JWT_SECRET } from '../config.js';

const { ValidationError } = joi;

export const isLoggedIn = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    jsonwebtoken.verify(req.headers.authorization, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = decoded;
        next();
    });
}

export const errorHandlerMiddleware = (error, _req, res, _next) => {
    if (error instanceof ValidationError) {
        return res.status(403).json({ message: error.details[0].message });
    } else {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}