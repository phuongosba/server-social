const mongoose = require("mongoose");
const Category = require("./Category");
const referrenceValidator = require("mongoose-referrence-validator");
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      min: 3,
      max: 50,
      unique: true,
    },
    authId: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    authorize: {
      type: Number,
      enum: [1, 2, 3],
      required: true,
      default: 3,
    },
    categories: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Category.collection.collectionName,
        },
      },
    ],
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    faculty: {
      type: String,
    },
  },
  { timestamps: true }
);
UserSchema.plugin(referrenceValidator);
module.exports = mongoose.model("User", UserSchema);
