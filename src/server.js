import express from "express";
import { join } from "path";
import authorRouter from "./apis/authors/index.js";
import blogPostsRouter from "./apis/blogposts/index.js";
import listEndPoints from "express-list-endpoints";
import cors from "cors";
import {
  handleBadRequestError,
  handleNotFoundError,
  handleUnauthorizedError,
  handleServerError,
} from "./errorHandlers.js";

import filesRouter from "./apis/files/index.js";

const server = express();
const port = 3003;

const publicFolderPath = join(process.cwd(), "./public");

//----MIDDLEWARES-------

server.use(express.static(publicFolderPath));
server.use(express.json());
server.use(cors());

server.use("/authors", authorRouter);
server.use("/blogposts", blogPostsRouter);
server.use("/files", filesRouter);

//------ ERROR HANDLERS------
server.use(handleBadRequestError);
server.use(handleNotFoundError);
server.use(handleUnauthorizedError);
server.use(handleServerError);

server.listen(port, () => {
  console.table(listEndPoints(server));
  console.log(
    `Rasmus, for your information: server is running on port ${port}`
  );
});
