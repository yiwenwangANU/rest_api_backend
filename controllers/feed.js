import { validationResult } from "express-validator";
import Post from "../models/post.js";
import { deleteFile } from "../utils/aws-s3.js";

export const getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "001",
        title: "First Post",
        content: "First Content",
        imageUrl: "images/dummy_image.jpg",
        creator: { name: "Max" },
        date: new Date(),
      },
    ],
  });
};

export const createPost = async (req, res, next) => {
  try {
    // in case of no image in req
    if (!req.file) {
      const error = new Error("No image uploaded!");
      error.statusCode = 422;
      next(error);
    }
    // in case of validate failed
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Delete the file from S3 if validation fails.
      if (req.file && req.file.key) {
        await deleteFile(req.file.key);
      }
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      next(error);
    }

    // create post object from req
    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.file.location; // Get the uploaded image url from s3

    const post = new Post({
      title: title,
      content: content,
      imageUrl: imageUrl,
      creator: { name: "Max" },
    });
    // insert object into mongodb
    const result = await post.save();
    res.status(201).json({
      message: "Post created successfully!",
      post: result,
    });
  } catch (err) {
    next(err);
  }
};

export default { getPosts, createPost };
