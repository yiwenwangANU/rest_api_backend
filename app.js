import dotenv from "dotenv";
dotenv.config();

import express from "express";
import feedRoutes from "./routes/feed.js";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    methods: "GET, POST, PUT, PATCH, DELETE",
    allowedHeaders: "Content-Type, Authorization",
  })
);
app.use("/feed", feedRoutes); // Handles actual routes last, after all necessary middleware.

mongoose
  .connect(process.env.MONGOOSE_CONNECTION_STRING)
  .then((result) => app.listen(8080))
  .catch((err) => console.log(err));
