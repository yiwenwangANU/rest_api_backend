const { validationResult } = require("express-validator");
const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
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

exports.createPost = (req, res, next) => {
  if (!req.file) {
    const error = new Error("No image uploaded!");
    error.statusCode = 422;
    throw error;
  }
  // if the validation failed, but image already been uploaded
  // delete the image and return 422 response
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    if (req.file) {
      const AWS = require("aws-sdk");
      AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
      });
      const s3 = new AWS.S3();
      s3.deleteObject(
        {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: req.file.key,
        },
        (err, data) => {
          if (err) console.error("Error deleting file from S3:", err);
          else console.log("Deleted file from S3");
        }
      );
    }
    throw error;
  }

  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file.location; // Get the uploaded image url from s3

  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: { name: "Max" },
  });
  post
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Post created successfully!",
        post: result,
      });
    })
    .catch((err) => console.log(err));
};
