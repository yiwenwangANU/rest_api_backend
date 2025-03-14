import dotenv from "dotenv";
dotenv.config();
import multer from "multer";
import multerS3 from "multer-s3-v3";
import { S3Client } from "@aws-sdk/client-s3";

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
      const error = new Error("Only .png, .jpg and .jpeg formats are allowed!");
      error.statusCode = 422;
      cb(error, false);
    }
  },
  limits: {
    fileSize: 2 * 2024 * 2024, // Limit file size to 2MB
  },
});

export default upload;
