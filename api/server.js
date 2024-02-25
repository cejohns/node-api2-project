// implement your server here
// require your posts router and connect it here
const express = require('express');
const cors = require('cors');
const postsRouter = require('./posts/posts-router');

const server = express();

server.use(cors());
server.use(express.json());

server.use('/api/posts', postsRouter);

module.exports = server;