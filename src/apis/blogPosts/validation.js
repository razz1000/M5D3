import { checkSchema, validationResult } from "express-validator";
import createError from "http-errors";

const postSchema = {
  category: {
    in: ["body"],
    isString: { errorMessage: "Category is required" },
  },
  title: {
    in: ["body"],
    isString: { errorMessage: "Title is required" },
  },

  cover: {
    in: ["body"],
    isString: { errorMessage: "Cover is required" },
  },

  "readTime.value": {
    in: ["body"],
    isInt: { errorMessage: "Read time is required" },
  },

  "readTime.unit": {
    in: ["body"],
    isString: { errorMessage: "Unit is required" },
  },

  "author.name": {
    in: ["body"],
    isString: { errorMessage: "Author's Name is required" },
  },
  "author.avatar": {
    in: ["body"],
    isString: { errorMessage: "Author's Avatar is required" },
  },

  createdAt: {
    in: ["body"],
  },
  content: {
    in: ["body"],
    isString: { errorMessage: "Content is required" },
  },
};

export const checkPostSchema = checkSchema(postSchema);
export const checkPostValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    next(createError(400, "validation errors", { errorsList: errors.array() }));
  } else {
    next();
  }
};