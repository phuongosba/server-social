const router = require("express").Router();
const User = require("../models/User");
const Notification = require("../models/FalcutyNotification");
const Category = require("../models/Category");
const dotenv = require("dotenv");
1;
const checkLogin = require("../middlewares/checkLogin");

dotenv.config();

function checkFalcuty(req, res, next) {
  let authorize = req.data.authorize;
  if (authorize !== 2) return res.status(403).json("You have not permission");
  next();
}

// Thông báo
router.get("/notifications", checkLogin, checkFalcuty, async (req, res) => {
  try {
    const notifications = await Notification.aggregate([
      { $match: { userId: req.data._id } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
    ]);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/notifications/:id", checkLogin, checkFalcuty, async (req, res) => {
  try {
    let id = req.params.id;
    const notification = await Notification.findById(id);
    if (!notification) res.status(404).json("Not found");
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/categories", checkLogin, checkFalcuty, async (req, res) => {
  try {
    const user = await User.aggregate([
      { $match: { _id: req.data._id } },
      {
        $lookup: {
          from: "categories",
          localField: "categories._id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $project: { _id: 0, category: 1 } },
    ]);
    if (!user) res.status(404).json("Not found");
    res.status(200).json(user[0].category);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Đăng bài thông báo
router.post("/notifications", checkLogin, checkFalcuty, async (req, res) => {
  try {
    const checkCategory = await User.findOne({
      categories: { _id: req.body.categoryId },
      _id: req.data._id,
    });
    if (!checkCategory)
      res.status(200).json({
        code: -1,
        message: "Bạn không có quyền đăng thông báo cho chuyên mục này.",
      });
    const newNotification = new Notification({
      title: req.body.title,
      content: req.body.content,
      categoryId: req.body.categoryId,
      userId: req.data._id,
    });

    const savedNotification = await newNotification.save();
    const cate = await Category.findById(req.body.categoryId);
    const cateName = cate.name;

    res.status(200).json({
      code: 1,
      message: {
        url: `/notification/noti/${savedNotification.slug}`,
        name: cateName,
        title: savedNotification.title,
      },
    });
  } catch (error) {
    res.status(400).json("Vui lòng nhập đầy đủ thông tin.");
  }
});

// Update notification
router.put("/notifications/:id", checkLogin, checkFalcuty, async (req, res) => {
  try {
    const id = req.params.id;
    const notification = await Notification.findOne({
      _id: id,
      falcutyId: req.data.id,
    });
    //Validate input
    if (
      !req.body.title ||
      req.body.title.length === 0 ||
      !req.body.content ||
      req.body.content.length === 0 ||
      !req.body.categoryId ||
      req.body.categoryId.length === 0
    ) {
      res
        .status(200)
        .json({ code: 0, message: `Vui lòng điền đầy đủ thông tin.` });
    }
    //Kiểm tra thông báo có tồn tại không
    if (!notification)
      res.status(200).json({ code: -1, message: "Thông báo không tồn tại." });

    //Kiểm tra người dùng có quyền đăng vào chuyên mục này không
    const checkCategory = await User.findOne({
      categories: { _id: req.body.categoryId },
    });
    if (!checkCategory)
      res.status(200).json({
        code: -1,
        message: "Bạn không có quyền đăng thông báo cho chuyên mục này.",
      });
    await notification.updateOne({
      $set: {
        title: req.body.title,
        content: req.body.content,
        categoryId: req.body.categoryId,
      },
    });
    res.status(200).json({
      code: 1,
      message: `Thông báo "${notification.title}" đã được cập nhật thành công`,
    });
  } catch (error) {
    res
      .status(200)
      .json({ code: 0, message: `Vui lòng điền đầy đủ thông tin.` });
  }
});

//Delete notification
router.delete(
  "/notifications/:id",
  checkLogin,
  checkFalcuty,
  async (req, res) => {
    try {
      const id = req.params.id;
      const notification = await Notification.findOne({
        _id: id,
        falcutyId: req.data.id,
      });
      if (!notification) res.status(404).json("Not found");
      notification.deleteOne().then((data) => {
        res
          .status(200)
          .json(`Xóa thông báo "${notification.title}" thành công.`);
      });
    } catch (error) {}
  }
);
module.exports = router;
