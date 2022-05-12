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
      await saveUsersAvatars(request.file.originalname, request.file.buffer);

      const blogposts = await getBlogPosts();

      const index = blogposts.findIndex(
        (post) => post.id === request.params.userId
      );
      if (index !== -1) {
        const oldPost = blogposts[index];
        const updatedBlogPost = {
          ...oldPost,
          ...request.body.cover,
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
/* 

blogPostsPublicFolderPath


const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");

filesRouter.post(
  "/:userId/avatar",
  multer().single("avatar"),
  async (req, res, next) => {
    // "avatar" needs to match exactly to the field name appended to the FormData object in the FE, otherwise Multer is not going to be able to find the file into the request body
    try {
      console.log("FILE: ", req.file);
      await saveUsersAvatars(req.file.originalname, req.file.buffer);

      // find user by userId in users.json

      // update avatar field of that user adding "/img/users/3kgdm0l30101f5.gif"
      // in FE "http://localhost:3001" + "/img/users/3kgdm0l30101f5.gif"
      res.send();
    } catch (error) {
      next(error);
    }
  }
);
 */
/* 

filesRouter.post(
  "/multipleUpload",
  multer().array("avatars"),
  async (req, res, next) => {
    try {
      console.log("FILE: ", req.files);

      const arrayOfPromises = req.files.map((file) =>
        saveUsersAvatars(file.originalname, file.buffer)
      );

      await Promise.all(arrayOfPromises);

      res.send();
    } catch (error) {
      next(error);
    }
  }
);

filesRouter.post(
  "/:userId/avatar",
  multer({
    fileFilter: (req, file, multerNext) => {
      if (file.mimetype !== "image/gif") {
        multerNext(createError(400, "Only GIF allowed!"));
      } else {
        multerNext(null, true);
      }
    },
    limits: { fileSize: 1 * 1024 },
  }).single("avatar"),
  async (req, res, next) => {
    // "avatar" needs to match exactly to the field name appended to the FormData object in the FE, otherwise Multer is not going to be able to find the file into the request body
    try {
      console.log("FILE: ", req.file);
      await saveUsersAvatars(req.file.originalname, req.file.buffer);

      // find user by userId in users.json

      // update avatar field of that user adding "/img/users/3kgdm0l30101f5.gif"
      // in FE "http://localhost:3001" + "/img/users/3kgdm0l30101f5.gif"
      res.send();
    } catch (error) {
      next(error);
    }
  }
); */

/* POST /authors/:id/uploadAvatar, uploads a picture (save as idOfTheAuthor.jpg in the public/img/authors folder) for the author specified by the id. Store the newly created URL into the corresponding author in authors.json
POST /blogPosts/:id/uploadCover, uploads a picture (save as idOfTheBlogPost.jpg in the public/img/blogPosts folder) for the blog post specified by the id. Store the newly created URL into the corresponding post in blogPosts.json
GET /blogPosts/:id/comments, get all the comments for a specific post
POST /blogPosts/:id/comments, add a new comment to the specific post
 */

export default filesRouter;
