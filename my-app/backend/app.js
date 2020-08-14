const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader(
    "Access-Control-Allow-Headers",
     "Origin, X-Requested-with, Content-Type, Accept");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.post('/api/posts', (req, res, next)=>{
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: "Post added successfully"
  });
});

app.get('/api/posts', (req, res, next)=>{
  const posts = [
    {id: 1, title: "first", content:"first content coming from the server"},
    {id: 2, title: "second", content:"second content coming from the server"},
    {id: 3, title: "third", content:"third content"},
    {id: 4, title: "fourth", content:"fourth content"},
    {id: 5, title: "fifth", content:"fifth content"},
    {id: 6, title: "sixth", content:"sixth content"},

  ];
  res.status(200).json({
    message: 'Post fetched successfully',
    posts: posts
  });
});

module.exports = app;
