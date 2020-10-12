const router = require("express").Router();
const { verifyToken } = require('../controllers/auth');
const { createPost, readPost, updatePost, deletePost, findPosts } = require("../controllers/post");
const { createPostValidator } = require("../validators");


router.post('/create', verifyToken, createPostValidator, createPost);
router.get('/read', verifyToken, readPost);
router.put('/update', verifyToken, updatePost);
router.delete('/delete', verifyToken, deletePost);

router.get('/posts', verifyToken, findPosts);

module.exports = router;