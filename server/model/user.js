const mongoose = require("mongoose");

// Profile image names and collections
const profile_imgs_name_list = [
  "Garfield", "Tinkerbell", "Annie", "Loki", "Cleo", "Angel",
  "Bob", "Mia", "Coco", "Gracie", "Bear", "Bella", "Abby",
  "Harley", "Cali", "Leo", "Luna", "Jack", "Felix", "Kiki",
];
const profile_imgs_collections_list = [
  "notionists-neutral", "adventurer-neutral", "fun-emoji",
];

// User Schema
const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
        },
        message: "Invalid email format.",
      },
    },
    password: {
      type: String,
      required: true,
    },
    total_links: {
      type: Number,
      default: 0,
    },
    profile_img: {
      type: String,
      default: () => {
        const collection =
          profile_imgs_collections_list[
            Math.floor(Math.random() * profile_imgs_collections_list.length)
          ];
        const seed =
          profile_imgs_name_list[
            Math.floor(Math.random() * profile_imgs_name_list.length)
          ];
        return `https://api.dicebear.com/6.x/${collection}/svg?seed=${seed}`;
      },
    },
    reset_password_otp: {
      type: Number,
      default: null,
    },
    reset_password_otp_expires: {
      type: Date,
      default: null,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    urls: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "urls",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// User Model
const USER = mongoose.model("users", userSchema);

module.exports = { USER };
