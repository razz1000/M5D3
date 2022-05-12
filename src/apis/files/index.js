import express from "express";
import multer from "multer";
import createError from "http-errors";
import { getBlogPosts, writeBlogPost } from "../../lib/fs-tools.js";
import { dirname, join } from "path";

import { saveUsersAvatars } from "../../lib/fs-tools.js";

const filesRouter = express.Router();

filesRouter.post(
  "/:userId/uploadCover",
  multer().single("avatar"),
  async (request, response, next) => {
    try {
      console.log("FILE:", request.file);
      const url = await saveUsersAvatars(
        request.file.originalname,
        request.file.buffer
      );

      const blogposts = await getBlogPosts();

      const index = blogposts.findIndex(
        (post) => post.id === request.params.userId
      );
      if (index !== -1) {
        const oldPost = blogposts[index];
        const updatedBlogPost = {
          ...oldPost,
          cover: url,
          updatedAt: new Date(),
        };
        blogposts[index] = updatedBlogPost;
        await writeBlogPost(blogposts);
        response.send(updatedBlogPost);
      }
    } catch (error) {
      next(error);
    }
  }
);

export default filesRouter;
