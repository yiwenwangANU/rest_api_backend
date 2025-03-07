const fs = require("fs");
const multer = require("multer");

if (!fs.existsSync("images")) {
  fs.mkdirSync("images");
}

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images"); // Save uploaded files to 'images/' directory
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

// File filter (optional, allows only certain file types)
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: fileStorage, fileFilter });

module.exports = upload;
