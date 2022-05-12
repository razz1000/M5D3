import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");

const authorsJSONpath = join(dataFolderPath, "authors.json");

const blogpostsJSONPATH = join(dataFolderPath, "blogposts.json");

const blogPostsPublicFolderPath = join(process.cwd(), "./public/img/blogPosts");

const authorsPostsPublicFolderPath = join(
  process.cwd(),
  "./public/img/authorPosts"
);

export const getAuthors = () => readJSON(authorsJSONpath);

export const writeAuthors = (authorsArray) =>
  writeJSON(authorsJSONpath, authorsArray);

export const getBlogPosts = () => readJSON(blogpostsJSONPATH);

export const writeBlogPost = (blogPostsArray) =>
  writeJSON(blogpostsJSONPATH, blogPostsArray);

export const saveUsersAvatars = (fileName, contentAsBuffer) => {
  const filePath = join(blogPostsPublicFolderPath, fileName);
  const whereWeSaved = `/img/blogPosts/${fileName}`;
  writeFile(filePath, contentAsBuffer);
  const url = `http://localhost:3003${whereWeSaved}`;
  return url;
};

export const saveAuthorsAvatars = (fileName, contentAsBuffer) => {
  const filePath = join(authorsPostsPublicFolderPath, fileName);
  const whereWeSaved = `/img/authorPosts/${fileName}`;
  writeFile(filePath, contentAsBuffer);
  const url = `http://localhost:3003${whereWeSaved}`;
  return url;
};
