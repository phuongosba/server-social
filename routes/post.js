const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");
const {
  checkLogin,
  checkUpdate,
  checkAdmin,
  checkFaculty,
} = require("../Middleware/checktoken");
const PAGE_SIZE = 10;
//create post
router.post("/", checkLogin, async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});
//get timeline post
router.get("/timeline", checkLogin, async (req, res) => {
  try {
    const userPosts = await Post.find({});
    const posts = userPosts.sort((p1, p2) => {
      return new Date(p2.createdAt) - new Date(p1.createdAt);
    });

    const page = req.query.page;
    const skip_item = (page - 1) * PAGE_SIZE;
    const end_item = page * PAGE_SIZE;
    const result = posts.slice(skip_item, end_item);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//update post
router.put("/:id", checkLogin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json(post);
    } else {
      res.status(403).json("you can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//delete post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      await Comment.deleteMany({ postId: req.params.id });
      res.status(200).json("the post has been delete");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//like post

router.put("/:id/like", checkLogin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("the post has been likes");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("the post has been dislikes");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//get post
router.get("/:id", checkLogin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get user's post
router.get("/profile/:userId", checkLogin, async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const posts = userPosts.sort((p1, p2) => {
      return new Date(p2.createdAt) - new Date(p1.createdAt);
    });
    const page = req.query.page;
    const skip_item = (page - 1) * PAGE_SIZE;
    const end_item = page * PAGE_SIZE;
    const result = posts.slice(skip_item, end_item);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
module.exports = router;
