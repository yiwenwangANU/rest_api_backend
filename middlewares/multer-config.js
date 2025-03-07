// const AWS = require("aws-sdk");
// const multer = require("multer");
// const multerS3 = require("multer-s3");

// // Configure AWS with credentials and region
// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

// const s3 = new AWS.S3();

// const storage = multerS3({
//   s3: s3,
//   bucket: process.env.AWS_BUCKET_NAME,
//   acl: "public-read",
//   key: (req, file, cb) => {
//     cb(
//       null,
//       new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
//     );
//   },
// });

// // File filter (optional, allows only certain file types)
// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === "image/png" ||
//     file.mimetype === "image/jpeg" ||
//     file.mimetype === "image/jpg"
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

// const upload = multer({ storage, fileFilter });

// module.exports = upload;

// multer-config.js
// multer-config.js
const multer = require("multer");
const multerS3 = require("multer-s3-v3");
const { S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    key: (req, file, cb) => {
      const fileName =
        new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname;
      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

module.exports = upload;
