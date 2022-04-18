const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const Post = require("./models/post");
const mongoose = require("mongoose");
const { catchError } = require("rxjs");
const postRoutes = require("./routes/post_routes");
const userRoutes = require("./routes/user_routes");
const { use } = require("./routes/user_routes");

const app = express();

mongoose
  .connect(
    "mongodb+srv://natoyato_abc:LSpCg9hQkGB3B5eO@cluster0.j9hmq.mongodb.net/first-db?retryWrites=true"
  )
  .then(() => {
    console.log("Conntected to Database");
  })
  .catch(() => {
    console.log("DataBase connection Failed");
  });
app.use(bodyParser.json());
app.use("/images", express.static(path.join("node_backend/img_up")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);
module.exports = app;
