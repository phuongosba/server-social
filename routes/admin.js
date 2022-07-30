const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Category = require("../models/Category");
const checkLogin = require("../middlewares/checkLogin");

// Tạo phòng/Khoa mới

function checkAdmin(req, res, next) {
  if (req.data.authorize !== 1) res.status(403).json("You have not permission");
  next();
}

//get  categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ code: 400, message: "Đã có lỗi" });
  }
});
router.get("/categories/:id", async (req, res) => {
  try {
    const categories = await Category.findById(req.params.id);
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ code: 400, message: "Đã có lỗi" });
  }
});
//update category
router.put("/categories/:id", checkLogin, checkAdmin, async (req, res) => {
  try {
    const cate = await Category.findById(req.params.id);
    await cate.updateOne({ name: req.body.name });
    res.status(200).json(cate);
  } catch (err) {
    res.status(500).json(err);
  }
});
//add category
router.post("/categories/add", checkLogin, checkAdmin, async (req, res) => {
  try {
    const categories = await Category.find();
    const checkCate = categories.find(
      (cate) => cate.name.toLowerCase() === req.body.name.toLowerCase()
    );
    if (checkCate) {
      res.status("403").json("Đã có danh mục");
    } else {
      const category = new Category({
        name: req.body.name,
      });
      await category.save();
      res.status(200).json(category);
    }
  } catch (error) {
    res.status(400).json({ code: 400, message: "Đã có lỗi" });
  }
});
//delete category
router.delete(
  "/categories/delete",
  checkLogin,
  checkAdmin,
  async (req, res) => {
    try {
      const deleteIds = req.body.ids;

      await Category.deleteMany({ _id: { $in: deleteIds } });
      Category.find({})
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((err) => {
          return res.status(500).json(err);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);

//get Faculty

router.get("/faculties", async (req, res) => {
  try {
    const user = await User.find();
    const faculty = user.filter((u) => u.authorize === 2);
    res.status(200).json(faculty);
  } catch (error) {
    res.status(400).json({ code: 400, message: "Đã có lỗi" });
  }
});
router.get("/faculties/:id", async (req, res) => {
  try {
    const faculties = await User.findById(req.params.id);
    res.status(200).json(faculties.name);
  } catch (error) {
    res.status(400).json({ code: 400, message: "Đã có lỗi" });
  }
});

module.exports = router;
