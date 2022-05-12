import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import { checkPostSchema, checkPostValidationResult } from "./validation.js";
import { getBlogPosts, writeBlogPost } from "../../lib/fs-tools.js";

const blogPostsRouter = express.Router();

/* const blogPostsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogPosts.json"
);
const getBlogPosts = () => JSON.parse(fs.readFileSync(blogPostsJSONPath));
const writeBlogPost = (blogPostsArray) =>
  fs.writeFileSync(blogPostsJSONPath, JSON.stringify(blogPostsArray));
 */
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

export default blogPostsRouter;
