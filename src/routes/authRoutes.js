import express from "express";
import { body } from "express-validator";
import authController from "../controllers/authController.js";
import upload from "../middlewares/multer-config.js";
import User from "../models/user.js";

const validateSignup = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom(async (value) => {
      const existingUser = await User.findOne({ email: value });
      if (existingUser) {
        return Promise.reject("Email already been used.");
      }
      return true;
    })
    .normalizeEmail(),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Please enter a valid password."),
  body("name")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Please enter a valid user name."),
];

const router = express.Router();

router.post(
  "/signup",
  upload.single("image"),
  validateSignup,
  authController.signup
);

router.post("/login", authController.login);

export default router;
