import dotenv from "dotenv";
dotenv.config();
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const deleteFile = async (filename) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filename,
    });
    const data = await s3Client.send(command);
    console.log("Success", data);
    return data;
  } catch (err) {
    console.error("Error", err);
    throw err;
  }
};
