const router = require("express").Router();
const Comment = require("../models/Comment");
const User = require("../models/User");

const {
  checkLogin,
  checkUpdate,
  checkAdmin,
  checkFaculty,
} = require("../Middleware/checktoken");

const createComment = async (req, res) => {
  const newComment = new Comment(req.body);
  try {
    const savedComment = await newComment.save();
    res.status(200).json(savedComment);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getCommentByPostId = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId });

    const listComments = comments.sort((p1, p2) => {
      return new Date(p1.createdAt) - new Date(p2.createdAt);
    });

    res.status(200).json(listComments);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};

const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (comment.userId === req.body.userId) {
      comment.content = req.body.content;

      const commentUpdated = await comment.save();
      res.status(200).json(commentUpdated);
    } else {
      res.status(403).json("you can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (comment.userId === req.body.userId) {
      await comment.deleteOne();
      res.status(200).json("the comment has been delete");
    } else {
      res.status(403).json("you can delete only your comment ");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

//create Comment
router.post("/", checkLogin, createComment);
//get timeline Comment
router.get("/:postId", getCommentByPostId);

//update Comment
router.put("/:id", checkLogin, updateComment);
// //delete Comment
router.delete("/:id", checkLogin, deleteComment);
// //like Comment

// router.put("/:id/like", checkLogin, likeComment);
// //get Comment
// router.get("/:id", checkLogin,getCommentById);

// //get user's Comment
// router.get("/profile/:userId", checkLogin,getCommentByUserId );
module.exports = router;
