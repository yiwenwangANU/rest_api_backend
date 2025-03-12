import express from "express";
import { body } from "express-validator";
import authController from "../controllers/authController.js";
import upload from "../middlewares/multer-config.js";

const validateUser = [
  body("email").isEmail().withMessage("Please enter a valid email."),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Please enter a valid password."),
];

const router = express.Router();

router.post(
  "/signup",
  upload.single("image"),
  validateUser,
  authController.signup
);

export default router;
