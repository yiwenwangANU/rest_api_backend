import express from "express";
import { body } from "express-validator";
import authController from "../controllers/authController.js";

const validateUser = [
  body("email").isEmail().withMessage("Please enter a valid email."),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Please enter a valid password."),
];

const router = express.Router();

router.post("/signup", validateUser, authController.signup);

export default router;
