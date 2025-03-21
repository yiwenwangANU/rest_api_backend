# API Documentation for MessageNode

This document provides an overview of the available API endpoints, request formats, and expected responses for the MessageNode application. The API is divided into several sections, including Health, Posts & Comments, and Authentication.

## Endpoints

### Health Check

- **GET** `/health`  
  **Description:** Checks if the server is running.  
  **Response:**
  - **Status Code:** 200 OK

---

### Posts & Comments Endpoints

All posts and comment routes are prefixed with `/feed`.

#### Get All Posts

**GET** `/feed/posts`

- **Description:** Retrieves a list of all posts.
- **Response:**
  - **Status Code:** 200 OK
  - **Body Example:**
  ```json
  {
    "posts": [
      {
        "_id": "postId1",
        "title": "First Post",
        "key": "example.jpg"
        "imageUrl": "/uploads/example.jpg",
        "creator":
            "_id": "creatorId1",
            "name": "username",
            "thumbnailUrl": "/uploads/thumbnail.jpg"
        "createdAt": "2023-08-01T12:00:00.000Z",
        "updatedAt": "2023-08-01T12:00:00.000Z",
        "__v": 0
      }
    ]
  }
  ```

#### Get a Single Post

**GET** `/feed/post/:postId`

- **Description:** Retrieves a single post and its comments by its unique ID.
- **Parameters:**
  - `postId` (path): The unique identifier of the post.
- **Response:**
  - **Status Code:** 200 OK
  - **Body Example:**
  ```json
  {
    "post": {
      "_id": "postId",
      "title": "First post",
      "key": "dummy-key.png",
      "imageUrl": "https://example.com/dummy-image.png",
      "creator": {
        "_id": "userId",
        "name": "username",
        "thumbnailUrl": "https://example.com/dummy-thumbnail.png"
      },
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z",
      "__v": 0
    },
    "comments": [
      {
        "_id": "commentId1",
        "content": "This is a sample comment.",
        "author": {
          "_id": "userId2",
          "name": "commenter1",
          "thumbnailUrl": "https://example.com/dummy-commenter-thumbnail.png"
        },
        "post": "postId",
        "createdAt": "2023-01-01T01:00:00.000Z",
        "__v": 0
      }
    ]
  }
  ```

#### Create a New Post

**POST** `/feed/posts`

- **Description:** Creates a new post.
- **Middlewares:**
  - `checkAuth`
  - `upload.single("image")`
  - `validatePost`
- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>`
- **Request (multipart/form-data):**
  - **Body:** - `title`: String
  - **File:** - `image`: (Optional) An image file.
- **Response:**
  - **Status Code:** 201 Created
  - **Body Example:**
  ```json
  {
    "message": "Post created successfully",
    "post": {
      "_id": "newPostId",
      "title": "My New Post",
      "key": "newImage.jpg",
      "imageUrl": "/uploads/newImage.jpg",
      "creator": "John Doe",
      "createdAt": "2023-08-01T12:00:00.000Z",
      "updatedAt": "2023-08-01T12:00:00.000Z"
    },
    "creator": {
      "_id": "creatorId",
      "name": "John Doe"
    }
  }
  ```

#### Update an Existing Post

**PUT** `/feed/post/:postId`

- **Description:** Updates an existing post.
- **Middlewares:**
  - `checkAuth`
  - `upload.single("image")`
  - `validatePost`
- **Parameters:**
  - `postId` (path): The unique identifier of the post.
- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>`
- **Request (multipart/form-data):**
  - **Body:**
    - `title`: Updated title (minimum 5 characters)
  - **File:**
    - `image`: (Optional) New image file.
- **Response:**
  - **Status Code:** 200 OK
  - **Body Example:**
  ```json
  {
    "message": "Post updated successfully!",
    "post": {
      "_id": "newPostId",
      "title": "My New Post",
      "key": "newImage.jpg",
      "imageUrl": "/uploads/newImage.jpg",
      "creator": "John Doe",
      "createdAt": "2023-08-01T12:00:00.000Z",
      "updatedAt": "2023-08-01T12:00:00.000Z"
    }
  }
  ```

#### Delete a Post

**DELETE** `/feed/post/:postId`

- **Description:** Deletes a post by its ID.
- **Middlewares:**
  - `checkAuth`
- **Parameters:**
  - `postId` (path): The unique identifier of the post.
- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>`
- **Response:**
  - **Status Code:** 200 OK

#### Create a Comment

**POST** `/feed/comment`

- **Description:** Adds a new comment to a post.
- **Middlewares:**
  - `checkAuth`
  - `validateComment`: Ensures that the comment content is at least 1 character.
- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>`
- **Request (JSON):**
  ```json
  {
    "postId": "postId1",
    "content": "This is a comment."
  }
  ```
- **Response:**
  - **Status Code:** 201 Created
  - **Body Example:**
  ```json
  {
    "message": "Comment created successfully",
    "comment": {
      "_id": "commentId",
      "content": "This is a comment.",
      "author": "userId"
      "post": "postId",
      "createdAt": "2023-08-01T12:45:00.000Z"
    }
  }
  ```

#### Get Comments of a Post

**GET** `/feed/comment/:postId`

- **Description:** Retrieves all comments associated with a given post.
- **Parameters:**
  - `postId` (path): The unique identifier of the post.
- **Response:**
  - **Status Code:** 200 OK
  - **Body Example:**
  ```json
  {
    "comments": [
      {
        "_id": "commentId1",
        "content": "This is a comment.",
        "author": "userId",
        "post": "postId",
        "createdAt": "2023-08-01T12:45:00.000Z"
      }
    ]
  }
  ```

---

### Authentication Endpoints

All authentication routes are prefixed with `/auth`.

#### User Signup

**POST** `/auth/signup`

- **Description:** Registers a new user.
- **Middlewares:**
  - `upload.single("image")`: Handles optional avatar upload.
  - `validateSignup`: Validates email, password, and name.
- **Request (multipart/form-data):**
  - **Body:**
    - `email`: Valid email address (must be unique)
    - `password`: String (minimum 5 characters)
    - `name`: Non-empty user name
  - **File:**
    - `image`: (Optional) User avatar file.
- **Response:**
  - **Status Code:** 201 Created
  - **Body Example:**
  ```json
  {
    "message": "User created successfully",
    "user": {
      "_id": "userId1",
      "email": "user@example.com",
      "name": "John Doe",
      "key": "avatar.jpg",
      "thumbnailUrl": "/uploads/avatar.jpg",
      "status": "offline"
    }
  }
  ```

#### User Login

**POST** `/auth/login`

- **Description:** Authenticates a user and returns a JWT token.
- **Request (JSON):**
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**
  - **Status Code:** 200 OK
  - **Body Example:**
  ```json
  {
    "token": "your_jwt_token",
    "user": {
      "_id": "userId1",
      "email": "user@example.com",
      "name": "John Doe",
      "avatarUrl": "/uploads/avatar.jpg"
    }
  }
  ```

---

## Error Responses

- **400 Bad Request:** Invalid input data or failed validations.
- **401 Unauthorized:** Missing or invalid authentication credentials.
- **404 Not Found:** Requested resource does not exist.
- **500 Internal Server Error:** Unexpected errors on the server.
