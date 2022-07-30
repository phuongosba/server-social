const router = require("express").Router();
const Notification = require("../models/FalcutyNotification");
const auth = require("../middlewares/checkLogin");
const Category = require("../models/Category");
const PAGE_SIZE = 10;
router.get("/", auth, async (req, res) => {
  try {
    const page = req.query.page;
    const notifications = await Notification.find().sort({ createdAt: -1 });
    if (page > 0) {
      const result = await notifications.slice(0, page);

      return res.status(200).json(result);
    }
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/getAll", auth, async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    const page = req.query.page;
    if (page) {
      const skip_item = (page - 1) * PAGE_SIZE;
      const end_item = page * PAGE_SIZE;
      const result = notifications.slice(skip_item, end_item);
      return res
        .status(200)
        .json({ result: result, len: notifications.length });
    }
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/cate/:slug", auth, async (req, res) => {
  try {
    const cate = await Category.findOne({ slug: req.params.slug });
    const notifications = await Notification.find({
      categoryId: cate._id,
    }).sort({
      createdAt: -1,
    });
    const page = req.query.page;
    if (page) {
      const skip_item = (page - 1) * PAGE_SIZE;
      const end_item = page * PAGE_SIZE;
      const result = notifications.slice(skip_item, end_item);

      return res
        .status(200)
        .json({ cate: cate, notifications: result, len: notifications.length });
    }
    res.status(200).json({ cate: cate, notifications: notifications });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/falcuty/:id", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.id });
    if (!notifications) {
      return res.status(404).json("Không tồn tại thông báo");
    }
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json(err);
  }
});
router.get("/:slug", auth, async (req, res) => {
  try {
    const notifications = await Notification.findOne({ slug: req.params.slug });
    if (!notifications) {
      return res.status(404).json("Không tồn tại thông báo");
    }
    console.log(notifications.categoryId);
    const cate = await Category.findById(notifications.categoryId);

    res.status(200).json({ cate: cate, notifications: notifications });
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
