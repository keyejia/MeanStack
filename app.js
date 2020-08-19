const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

const postsRoutes = require('./routes/post');
const userRoutes = require('./routes/user');

mongoose.connect("mongodb+srv://kellen:"+ process.env.MONGO_ATLAS_PW +"@cluster0.chvpk.mongodb.net/node-angular?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=>{
    console.log('Connected to Database!');
  })
  .catch(err=>{
    console.log(err.message);
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use("/images", express.static(path.join(__dirname, "images")));
  app.use("/", express.static(path.join(__dirname, "angular")));


  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader(
      "Access-Control-Allow-Headers",
       "Origin, X-Requested-with, Content-Type, Accept, Authorization");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, DELETE, PUT, OPTIONS");
    next();
  });

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);
app.use((req, res, next)=>{
  res.sendFile(path.join(__dirname, "angular", "index.html"));
});

module.exports = app;
