// implement your posts router here
const express = require('express');
const router = express.Router();
const Posts = require('./posts-model');

// [GET] /api/posts
router.get('/', async (req, res) => {
  try {
    const posts = await Posts.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "The posts information could not be retrieved" });
  }
});

// [GET] /api/posts/:id
router.get('/:id', async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "The post with the specified ID does not exist" });
    } else {
      res.json(post);
    }
  } catch (error) {
    res.status(500).json({ message: "The post information could not be retrieved" });
  }
});

// [POST] /api/posts
router.post('/', async (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    return res.status(400).json({ message: "Please provide title and contents for the post" });
  }

  try {
    // Assuming the insert method returns the id of the newly inserted post
    const result = await Posts.insert({ title, contents });
    const newPostId = result.id; // Ensure this matches how your database returns the id
    const newPost = await Posts.findById(newPostId);

    if (newPost) {
      res.status(201).json(newPost);
    } else {
      res.status(500).json({ message: "There was an error while saving the post to the database" });
    }
  } catch (error) {
    res.status(500).json({ message: "There was an error while saving the post to the database" });
  }
});

// [PUT] /api/posts/:id
router.put('/:id', async (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    return res.status(400).json({ message: "Please provide title and contents for the post" });
  }

  try {
    const updated = await Posts.update(req.params.id, { title, contents });
    if (updated) {
      const updatedPost = await Posts.findById(req.params.id);
      res.json(updatedPost);
    } else {
      res.status(404).json({ message: "The post with the specified ID does not exist" });
    }
  } catch (error) {
    res.status(500).json({ message: "The post information could not be modified" });
  }
});

// [DELETE] /api/posts/:id
router.delete('/:id', async (req, res) => {
    try {
        // Attempt to retrieve the post before deletion to return it in the response
        const post = await Posts.findById(req.params.id);
        if (!post) {
          return res.status(404).json({ message: "The post with the specified ID does not exist" });
        }
        await Posts.remove(req.params.id);
        // Return the deleted post object instead of just a message
        res.json(post);
      } catch (error) {
        res.status(500).json({ message: "The post could not be removed" });
      }
});

// [GET] /api/posts/:id/comments
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Posts.findPostComments(req.params.id);
    if (comments.length > 0) {
      res.json(comments);
    } else {
      res.status(404).json({ message: "The post with the specified ID does not exist or has no comments" });
    }
  } catch (error) {
    res.status(500).json({ message: "The comments information could not be retrieved" });
  }
});

module.exports = router;