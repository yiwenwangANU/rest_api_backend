import express from "express";
import { body } from "express-validator";

const validateUser = [
  body("email").isEmail().withMessage("Please enter a valid email."),
  body("content")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Content must be at least 5 characters."),
];

const router = express.Router();

router.post("/signup", validateUser);
export default router;
