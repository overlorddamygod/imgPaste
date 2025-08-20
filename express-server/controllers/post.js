import express from "express";
import prismaClient from "../prisma/index.js";
import { isLoggedIn } from "../middlewares/index.js";
import { addPostItemSchema } from "../helpers/validator/post.js";
import fileUpload from "express-fileupload";
import { randomUUID } from 'crypto';

const postRouter = express.Router();
postRouter.use(fileUpload());

postRouter.post('/create', isLoggedIn, async (req, res, next) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).send({ message: "Title is required." });
    }

    try {
        const result = await prismaClient.post.create({
            data: {
                title: title,
                authorId: req.user.id
            }
        });

        return res.status(201).send({
            message: "Post created successfully.", data: {
                post: {
                    id: result.id,
                    title: result.title,
                }
            }
        });
    } catch (error) {
        next(error)
    }

});

postRouter.get('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        const post = await prismaClient.post.findUnique({
            where: {
                id: id 
            },
            include: {
                postItems: true,
                author: true
            }
        });

        if (!post) {
            return res.status(404).send({ message: "Post not found." });
        }

        return res.status(200).send({ data: {post} });
    } catch (error) {
        next(error)
    }
});

postRouter.get('/postItem/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        const postItem = await prismaClient.postItem.findUnique({
            where: {
                id: id 
            },
            include: {
                post: {
                    include: {
                        author: true
                    }
                },
            }
        });

        if (!postItem) {
            return res.status(404).send({ message: "Post not found." });
        }

        return res.status(200).send({ data: {postItem} });
    } catch (error) {
        next(error)
    }
});

// add post item (text)
postRouter.post('/addPostItem/text', isLoggedIn, async (req, res, next) => {
    const { id, type, content } = req.body;
    console.log(id)
    try {
        await addPostItemSchema.validateAsync({ id, type, content });

        if (type !== "text") {
            return res.status(400).send({ message: "Invalid type for text endpoint." });
        }

        const post = await prismaClient.post.findUnique({
            where: { id }
        });

        if (!post) {
            return res.status(404).send({ message: "Post not found." });
        }

        if (post.authorId !== req.user.id) {
            return res.status(403).send({ message: "Unauthorized" });
        }

        if (!content) {
            return res.status(400).send({ message: "Content is required." });
        }

        await prismaClient.postItem.create({
            data: {
                type,
                content,
                postId: id
            }
        });

        return res.status(201).send({ message: "Post item added successfully." });
    } catch (error) {
        next(error);
    }
});

// add post item (image)
postRouter.post('/addPostItem/image', isLoggedIn, async (req, res, next) => {
    const { id, type } = req.body;

    try {
        if (type !== "image") {
            return res.status(400).send({ message: "Invalid type for image endpoint." });
        }

        const post = await prismaClient.post.findUnique({
            where: { id }
        });

        if (!post) {
            return res.status(404).send({ message: "Post not found." });
        }

        if (post.authorId !== req.user.id) {
            return res.status(403).send({ message: "Unauthorized" });
        }

        if (!req.files || !req.files.content) {
            return res.status(400).send({ message: "Image is required." });
        }

        const image = req.files.content;
        const imageName = `${randomUUID()}-${image.name}`;
        const imagePath = `./public/${imageName}`;

        image.mv(imagePath, (err) => {
            if (err) {
                return res.status(500).send({ message: "Failed to upload image." });
            }
        });

        await prismaClient.postItem.create({
            data: {
                id: randomUUID(), // Use UUID for postItem id
                type,
                content: imagePath.slice(1),
                postId: id
            }
        });

        return res.status(201).send({ message: "Post item added successfully." });
    } catch (error) {
        next(error);
    }
});

postRouter.delete('/:id', isLoggedIn, async (req, res, next) => {
    const { id } = req.params;

    try {
        const post = await prismaClient.post.findUnique({
            where: {
                id
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
                id
            }
        });

        return res.status(200).send({ message: "Post deleted successfully." });
    } catch (error) {
        next(error)
    }
});

postRouter.delete('/postItem/:id', isLoggedIn, async (req, res, next) => {
    const { id } = req.params;

    try {
        const postItem = await prismaClient.postItem.findUnique({
            where: {
                id
            },
            include: {
                post: true
            }
        });

        if (!postItem) {
            return res.status(404).send({ message: "Post Item not found." });
        }

        if (postItem.post.authorId !== req.user.id) {
            return res.status(403).send({ message: "Unauthorized" });
        }

        await prismaClient.postItem.delete({
            where: {
                id
            }
        });

        return res.status(200).send({ message: "Post Item deleted successfully." });
    } catch (error) {
        next(error)
    }
});

export default postRouter;