const express = require('express');
const mongoose = require('mongoose');
const { resolve } = require('path');
const Post = require('./schema');

const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(express.json());

mongoose
  .connect('mongodb://localhost:27017/blogDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB:', err));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

// Create a new blog post
app.post('/api/posts', async (req, res) => {
  const post = new Post(req.body);
  try {
    const savedPost = await post.save();
    res.status(201).send(savedPost);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all blog posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a single blog post by id
app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send();
    }
    res.status(200).send(post);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a blog post by id
app.put('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!post) {
      return res.status(404).send();
    }
    res.status(200).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a blog post by id
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).send();
    }
    res.status(200).send(post);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
