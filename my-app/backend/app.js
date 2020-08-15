const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');

const postsRoutes = require('./routes/post');

mongoose.connect("mongodb+srv://kellen:vJpKyWJbSzNnI2M5@cluster0.chvpk.mongodb.net/node-angular?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=>{
    console.log('Connected to Database!');
  })
  .catch(err=>{
    console.log(err.message);
  });

  app.use(bodyParser.json());

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader(
      "Access-Control-Allow-Headers",
       "Origin, X-Requested-with, Content-Type, Accept");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, DELETE, PUT, OPTIONS");
    next();
  });

app.use("/api/posts", postsRoutes);

module.exports = app;
