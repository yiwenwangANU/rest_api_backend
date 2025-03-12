import { validationResult } from "express-validator";
import User from "../models/user.js";
import { deleteFile } from "../utils/aws-s3.js";

export const signup = async (req, res, next) => {
  try {
    // in case of validate failed
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Delete the file from S3 if validation fails.
      if (req.file && req.file?.key) {
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
    const email = req.body.email;
    const password = req.body.password;
    // Hash the password with bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const key = req.file?.key; // key is the file name
    const thumbNailUrl = req.file?.location; // Get the uploaded image url from s3

    const user = new User({
      email: email,
      password: hashedPassword,
      key: key,
      thumbnailUrl: thumbNailUrl,
      status: "offline",
    });
    // insert object into mongodb
    const result = await user.save();
    res.status(201).json({
      message: "User created successfully!",
      user: result,
    });
  } catch (err) {
    next(err);
  }
};

export default { signup };
