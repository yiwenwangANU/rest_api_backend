import { validationResult } from "express-validator";
import Post from "../models/post.js";
import { deleteFile } from "../utils/aws-s3.js";

export const getPosts = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 5; // Set your desired page size
  const skip = (page - 1) * pageSize; // Skip first * posts for pagination
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / pageSize);
    const nextPage = page < totalPages ? page + 1 : null;
    console.log(posts);
    res.status(200).json({ posts, currentPage: page, nextPage });
  } catch {
    (err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    };
  }
};

export const getPost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Post not found!");
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({ post: post });
  } catch {
    (err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    };
  }
};

export const createPost = async (req, res, next) => {
  try {
    // in case of no image in req
    if (!req.file) {
      const error = new Error("No image uploaded!");
      error.statusCode = 422;
      return next(error);
    }
    // in case of validate failed
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Delete the file from S3 if validation fails.
      if (req.file && req.file.key) {
        await deleteFile(req.file.key);
      }
      // Get error message from validator
      const errorMessages = errors
        .array()
        .map((err) => err.msg)
        .join(" ");

      const error = new Error(
        errorMessages || "Validation failed, entered data is incorrect."
      );
      error.statusCode = 422;
      return next(error);
    }

    // create post object from req
    const title = req.body.title;
    const content = req.body.content;
    const key = req.file.key; // key is the file name
    const imageUrl = req.file.location; // Get the uploaded image url from s3

    const post = new Post({
      title: title,
      content: content,
      key: key,
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

export const updatePost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    // in case of validate failed
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Delete the file from S3 if validation fails.
      if (req.file && req.file.key) {
        await deleteFile(req.file.key);
      }
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      return next(error);
    }
    // find post by postId and update with req body and file

    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Post not found!");
      error.statusCode = 404;
      return next(error);
    }
    post.title = req.body.title;
    post.content = req.body.content;
    if (req.file && post.key) {
      // if there is a new image upload
      await deleteFile(post.key); //delete old image from s3
      post.key = req.file.key; // set new key and imageUrl
      post.imageUrl = req.file.location;
    }

    // insert object into mongodb
    const result = await post.save();
    res.status(200).json({
      message: "Post updated successfully!",
      post: result,
    });
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Post not found!");
      error.statusCode = 404;
      return next(error);
    }
    if (post.key) {
      await deleteFile(post.key); // delete image from s3
    }
    await post.deleteOne(); // delete from database
    res.status(200).json({ post: post });
  } catch {
    (err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    };
  }
};

export default { getPosts, getPost, createPost, updatePost, deletePost };
