import dotenv from "dotenv";
dotenv.config();

import express from "express";
import postRoutes from "./routes/postRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    methods: "GET, POST, PUT, PATCH, DELETE",
    allowedHeaders: "Content-Type, Authorization",
  })
);
// for ALB health check
app.get("/health", (req, res) => {
  res.sendStatus(200); // returns HTTP 200 OK
});
app.use("/feed", postRoutes); // Handles actual routes last, after all necessary middleware.
app.use("/auth", authRoutes);

// Centralized error handling middleware (must be after routes)
app.use(errorHandler);

mongoose
  .connect(process.env.MONGOOSE_CONNECTION_STRING)
  .then((result) =>
    app.listen(8080, "0.0.0.0", () => {
      console.log("Server running on port 8080");
    })
  )
  .catch((err) => console.log(err));
