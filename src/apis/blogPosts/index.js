import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import { checkPostSchema, checkPostValidationResult } from "./validation.js";
import { getBlogPosts, writeBlogPost } from "../../lib/fs-tools.js";
import { checkCommentSchema } from "./validation.js";
import path from "path";

const blogPostsRouter = express.Router();

blogPostsRouter.post(
  "/",
  checkPostSchema,
  checkPostValidationResult,
  async (request, response, next) => {
    try {
      const newBlogPost = {
        ...request.body,
        createdAt: new Date(),
        id: uniqid(),
      };

      const blogPost = await getBlogPosts();

      blogPost.push(newBlogPost);
      await writeBlogPost(blogPost);
      response.status(201).send({ id: newBlogPost.id });
    } catch (error) {
      next(error);
    }
  }
);
blogPostsRouter.get("/", async (request, response, next) => {
  try {
    const blogposts = await getBlogPosts();
    console.log("This is the content:", blogposts);
    response.send(blogposts);
  } catch (error) {
    next(error);
  }
});
blogPostsRouter.get("/:postId", async (request, response, next) => {
  const blogposts = await getBlogPosts();
  const blogPostsFound = blogposts.find(
    (post) => post.id === request.params.postId
  );
  response.send(blogPostsFound);
});
blogPostsRouter.put(
  "/:postId",
  checkPostSchema,
  checkPostValidationResult,
  async (request, response, next) => {
    const blogposts = await getBlogPosts();
    console.log("these are the blogposts:", blogposts);
    const index = blogposts.findIndex(
      (post) => post.id === request.params.postId
    );
    if (index !== -1) {
      const oldPost = blogposts[index];
      const updatedBlogPost = {
        ...oldPost,
        ...request.body,
        updatedAt: new Date(),
      };
      blogposts[index] = updatedBlogPost;
      await writeBlogPost(blogposts);
      response.send(updatedBlogPost);
    }
  }
);
blogPostsRouter.delete(
  "/:postId",
  checkPostValidationResult,
  async (request, response, next) => {
    const blogposts = await getBlogPosts();
    const remainingBlogPosts = blogposts.filter(
      (post) => post.id !== request.params.postId
    );
    await writeBlogPost(remainingBlogPosts);
    response.status(204).send();
  }
);

blogPostsRouter.put(
  "/:id/comment",
  checkCommentSchema,

  async (req, res, next) => {
    try {
      const { text, userName } = req.body;
      const comment = { id: uniqid(), text, userName, createdAt: new Date() };
      const fileAsBuffer = fs.readFileSync(blogsFilePath);

      const fileAsString = fileAsBuffer.toString();

      let fileAsJSONArray = JSON.parse(fileAsString);

      const blogIndex = fileAsJSONArray.findIndex(
        (blog) => blog.id === req.params.id
      );
      if (!blogIndex == -1) {
        res
          .status(404)
          .send({ message: `blog with ${req.params.id} is not found!` });
      }
      const previousblogData = fileAsJSONArray[blogIndex];
      previousblogData.comments = previousblogData.comments || [];
      const changedblog = {
        ...previousblogData,
        ...req.body,
        comments: [...previousblogData.comments, comment],
        updatedAt: new Date(),
        id: req.params.id,
      };
      fileAsJSONArray[blogIndex] = changedblog;

      fs.writeFileSync(blogsFilePath, JSON.stringify(fileAsJSONArray));
      res.send(changedblog);
    } catch (error) {
      console.log(error);
      res.send(500).send({ message: error.message });
    }
  }
);

export default blogPostsRouter;
