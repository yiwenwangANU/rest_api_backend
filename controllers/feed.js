const { validationResult } = require("express-validator");

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
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({
      message: "Validation failed, incorrect data!",
      errors: errors.array(),
    });
  if (!req.file) {
    const error = new Error("No file uploaded!");
    error.statusCode(422);
    throw error;
  }

  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file.path; // Get the uploaded image file path

  res.status(201).json({
    message: "Post created successfully!",
    post: {
      id: new Date().toISOString(),
      title: title,
      content: content,
      imageUrl: imageUrl,
    },
  });
};
