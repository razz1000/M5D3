import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");

const authorsJSONpath = join(dataFolderPath, "authors.json");

const blogpostsJSONPATH = join(dataFolderPath, "blogposts.json");
console.log(blogpostsJSONPATH);

const blogPostsPublicFolderPath = join(process.cwd(), "./public/img/blogPosts");

export const getAuthors = () => readJSON(authorsJSONpath);
export const writeAuthors = (authorsArray) =>
  writeJSON(authorsJSONpath, authorsArray);
export const getBlogPosts = () => readJSON(blogpostsJSONPATH);
export const writeBlogPost = (blogPostsArray) =>
  writeJSON(blogpostsJSONPATH, blogPostsArray);

export const saveUsersAvatars = (fileName, contentAsBuffer) =>
  writeFile(join(blogPostsPublicFolderPath, fileName), contentAsBuffer);
