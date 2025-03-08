const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

exports.deleteFile = (filename) => {
  return new Promise((resolve, reject) => {
    s3.deleteObject(
      { Bucket: process.env.AWS_BUCKET_NAME, Key: filename },
      function (err, data) {
        if (err) {
          console.log("Error", err);
          reject(err);
        } else {
          console.log("Success", data);
          resolve(data);
        }
      }
    );
  });
};
