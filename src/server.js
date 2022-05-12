import express from "express";
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

const server = express();
const port = 3003;

//----MIDDLEWARES-------

server.use(express.json());
server.use(cors());

server.use("/authors", authorRouter);
server.use("/blogposts", blogPostsRouter);

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
