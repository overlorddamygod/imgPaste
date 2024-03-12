import {Router} from "express"
import jsonwebtoken from "jsonwebtoken"
import prismaClient from "../prisma/index.js"
import bcrypt from "bcrypt"
import { JWT_SECRET } from "../config.js"
import { loginSchema, registerSchema } from "../helpers/validator/auth.js"

const authRouter = Router()

authRouter.post('/register', async (req, res, next) => {
    const { email, password, confirmPassword } = req.body;

    try {
        await registerSchema.validateAsync({ email, password, confirmPassword })

        const result = await prismaClient.user.findUnique({
            where: {
                email: email
            }
        });

        if (result) {
            return res.status(400).send({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prismaClient.user.create({
            data: {
                email: email,
                password: hashedPassword
            }
        });

        return res.status(201).send({ message: "User created successfully." });
    } catch (error) {
        next(error);
    }
});

authRouter.post('/login', async (req, res, next) => {
    const { email, password } = req.body;

    try {
        await loginSchema.validateAsync({ email, password });

        const user = await prismaClient.user.findUnique({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.status(400).send({ message: "User does not exist" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).send({ message: "Invalid password" });
        }

        const token = jsonwebtoken.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });

        return res.status(200).send({ data: {token} });
    } catch (error) {
        next(error)
    }
});

export default authRouter;