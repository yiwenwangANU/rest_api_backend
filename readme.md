# MessageNode

Welcome to the Messagenode! Message node is community-driven platform inspired by Reddit. Registered users can create posts and comments. Visitors are welcome to browse and enjoy the content.

This project is a full-stack project with a modern frontend built using **React**, and a robust backend powered by **Node.js** and **Express**. It enables users to interact with a dynamic API and features real-time functionality.

This repo is the **Backend** part of the project. Here is the link to the **Frontend**.
https://github.com/yiwenwangANU/rest_api_frontend

## Getting Started 🚀

### Installation

Clone the repository and install the dependencies:

```
git clone https://github.com/yiwenwangANU/rest_api_backend.git
cd rest_api_backend
npm install
```

### Environment Variables

Create .env file in the root dir that contains the following variables

- _JWT_SECRET_: for jwt encryption
- _AWS_ACCESS_KEY_ID_: for image storage in S3
- _AWS_SECRET_ACCESS_KEY_: for image storage in S3
- _AWS_REGION_: for image storage in S3
- _AWS_BUCKET_NAME_: for image storage in S3
- _DEFAULT_THUMBNAIL_: URL of default user avatar
- _MONGOOSE_CONNECTION_STRING_: for MongoDB Atlas connection

### Running Locally

Start the development server:

```
npm start
```

Your API will be available at http://localhost:8080.

## API Overview

The MessageNode application is powered by a RESTful API built with Express. The API provides endpoints for managing posts, comments, and user authentication. Key features include:

- **Posts & Comments:**
  - Create, update, and delete posts (with image upload support).
  - Retrieve individual posts along with their associated comments.
- **User Authentication:**
  - Secure signup and login endpoints.
  - JWT-based authentication to protect sensitive operations.
- **Integration:**
  - The frontend communicates with the API using axios, with an `axiosInstance` configured to include JWT tokens in the `Authorization` header.
  - The API is documented in detail in the [API Documentation](./API_DOCS.md).

This design ensures that the API remains scalable and easy to integrate with various client applications.

## Deployment

The API was deployed in ECS powered by AWS. In addition, MongoDB Atlas is used as the primary database and AWS S3 is utilized for image storage.

For the security and high-availability, the API was deploy in the private subnet within the VPC that has two public subnets and two private subnets(in different AZs). An Application Load Balancer in public subnet routes traffic securely (HTTPS) to the application and serve as end point.

The API implement CI/CD using AWS CodePipeline. It detects changes in this Git repository and triggers the pipeline. After that, CodeBuild will compile the code, builds a Docker image, and pushes that image to Amazon ECR. Then it will update the ECS service to use the new image.

For detailed instructions, see the [AWS Deployment Guide](./AWS_Deployment.md).

## NPM Packages used 📦

- **body-parser:**  
  Parses incoming request bodies in middleware, facilitating JSON transmission.

- **cors:**  
  Enables Cross-Origin Resource Sharing (CORS) for secure cross-site requests.

- **dotenv:**  
  Loads environment variables from a `.env` file, simplifying configuration management.

- **express-validator:**  
  Provides middleware for validating incoming requests with various rules.

- **mongoose:**  
  An ODM (Object Data Modeling) library for MongoDB, enabling schema-based data modeling.

- **multer:**  
  Handles multipart/form-data for receiving file uploads in forms.

- **@aws-sdk/client-s3:**  
  AWS SDK for JavaScript v3 to interact with AWS S3 for image and file storage.

- **bcrypt:**  
  A library for hashing passwords to enhance security.

- **jsonwebtoken:**  
  Implements JSON Web Tokens (JWT) for authentication and secure API communication.

- **multer-s3:**  
  Integrates multer with AWS S3 to store uploaded files directly in an S3 bucket.
