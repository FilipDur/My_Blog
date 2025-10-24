require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Připojení k MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// Definice jednoduchého modelu Post
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now }
});
const Post = mongoose.model('Post', postSchema);

// API endpointy
app.get('/api/posts', async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

app.post('/api/posts', async (req, res) => {
  const { title, content } = req.body;
  const newPost = new Post({ title, content });
  await newPost.save();
  res.json(newPost);
});

// Servírování frontend
app.use(express.static(path.join(__dirname, '../frontend')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server běží na portu ${PORT}`));
