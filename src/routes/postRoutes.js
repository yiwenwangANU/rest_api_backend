import express from "express";
import postController from "../controllers/postController.js";
import { body } from "express-validator";
import upload from "../middlewares/multer-config.js";
import { checkAuth } from "../middlewares/checkAuth.js";

const router = express.Router();

const validatePost = [
  body("title")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Title must be at least 5 characters."),
  body("content")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Content must be at least 5 characters."),
];

const validateComment = [
  body("comment")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Title must be at least 5 characters."),
];
// GET posts
router.get("/posts", postController.getPosts);

// GET single post
router.get("/post/:postId", postController.getPost);

// POST /feed/posts
router.post(
  "/posts",
  checkAuth,
  upload.single("image"), //multer must run before any middleware that reads the request body
  validatePost,
  postController.createPost
);

router.put(
  "/post/:postId",
  checkAuth,
  upload.single("image"), //multer must run before any middleware that reads the request body
  validatePost,
  postController.updatePost
);

router.delete("/post/:postId", checkAuth, postController.deletePost);

router.post(
  "/comment/:postId",
  checkAuth,
  validateComment,
  postController.createComment
);

export default router;
