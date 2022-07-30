const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");

mongoose.plugin(slug);
const Category = new mongoose.Schema(
  {
    name: {
      type: String,
      reuqired: true,
      maxlength: 256,
      unique: true,
    },
    slug: {
      type: String,
      slug: "name",
      unique: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Category", Category);
