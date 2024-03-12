import express from "express";
import authRouter from "./controllers/auth.js";
import { PORT } from "./config.js";
import { errorHandlerMiddleware } from "./middlewares/index.js";
import postRouter from "./controllers/post.js";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.use(cors())
app.use(express.json());
app.use(morgan('dev'));
app.use("/public", express.static('public'));

app.use("/auth", authRouter);
app.use("/post", postRouter);

app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})