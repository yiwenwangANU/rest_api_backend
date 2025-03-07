const express = require("express");
const feedRoutes = require("./routes/feed");
const bodyParser = require("body-parser");
const cors = require("cors");

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

app.listen(8080);
