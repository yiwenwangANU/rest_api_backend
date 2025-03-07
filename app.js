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
  .connect(
    "mongodb+srv://paradoxraphael:cL0HrZ7dGvVbD9hk@cluster0.rb9vaxh.mongodb.net/messages?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then((result) => app.listen(8080))
  .catch((err) => console.log(err));
