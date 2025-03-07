require("dotenv").config();
const express = require("express");
const feedRoutes = require("./routes/feed");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

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
