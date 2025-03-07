const express = require("express");
const feedController = require("../controllers/feed");
const { body } = require("express-validator");
const upload = require("../middlewares/multer-config");

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

// GET /feed/posts
router.get("/posts", feedController.getPosts);

// POST /feed/posts
router.post(
  "/posts",
  upload.single("image"), //multer must run before any middleware that reads the request body
  validatePost,
  feedController.createPost
);

module.exports = router;
