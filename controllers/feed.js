exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [{ title: "First Post", content: "First Content" }],
  });
};

exports.createPost = (req, res, next) => {
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
