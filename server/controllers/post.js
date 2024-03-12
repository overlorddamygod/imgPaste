import express from "express";
import prismaClient from "../prisma/index.js";
import { isLoggedIn } from "../middlewares/index.js";
import { addPostItemSchema } from "../helpers/validator/post.js";
import fileUpload from "express-fileupload";

const postRouter = express.Router();
postRouter.use(fileUpload());

postRouter.post('/create', isLoggedIn, async (req, res, next) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).send({ message: "Title is required." });
    }

    try {
        prismaClient.post.create({
            data: {
                title: title,
                authorId: req.user.id
            }
        });

        return res.status(201).send({ message: "Post created successfully." });
    } catch (error) {
        next(error)
    }

});

postRouter.get('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        const post = await prismaClient.post.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!post) {
            return res.status(404).send({ message: "Post not found." });
        }

        return res.status(200).send({ data: post });
    } catch (error) {
        next(error)
    }
});

// add post item to the post
postRouter.post('/addPostItem', isLoggedIn, async (req, res, next) => {
    const { id, type, content } = req.body;

    try {
        addPostItemSchema.validateAsync({ id, type, content });

        if (type !== "text" && type !== "image") {
            return res.status(400).send({ message: "Invalid type." });
        }

        const post = await prismaClient.post.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!post) {
            return res.status(404).send({ message: "Post not found." });
        }

        if (post.authorId !== req.user.id) {
            return res.status(403).send({ message: "Unauthorized" });
        }

        if (type === "image") {
            if (!req.files || !req.files.image) {
                return res.status(400).send({ message: "Image is required." });
            }

            const image = req.files.image;
            const imagePath = `${__dirname}/../../public/${image.name}`;

            image.mv(imagePath, (err) => {
                if (err) {
                    return res.status(500).send({ message: "Failed to upload image." });
                }
            });

            await prismaClient.postItem.create({
                data: {
                    type,
                    content: imagePath,
                    postId: parseInt(id)
                }
            });
        } else {
            await prismaClient.postItem.create({
                data: {
                    type,
                    content: content,
                    postId: parseInt(id)
                }
            });
        }

        return res.status(201).send({ message: "Post item added successfully." });
    } catch (error) {
        next(error)
    }
});

postRouter.delete('/delete/:id', isLoggedIn, async (req, res, next) => {
    const { id } = req.params;

    try {
        const post = await prismaClient.post.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!post) {
            return res.status(404).send({ message: "Post not found." });
        }

        if (post.authorId !== req.user.id) {
            return res.status(403).send({ message: "Unauthorized" });
        }

        await prismaClient.post.delete({
            where: {
                id: parseInt(id)
            }
        });

        return res.status(200).send({ message: "Post deleted successfully." });
    } catch (error) {
        next(error)
    }
});

export default postRouter;