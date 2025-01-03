const mongoose = require("mongoose");
const { Schema } = mongoose;

const urlSchema = new Schema(
  {
    original_url: {
      type: String,
      required: true,
    },
    custom_url: {
      type: String,
      unique: true,
      lowercase: true,
    },
    short_url: {
      type: String,
      required: true,
      unique: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    title: {
      type: String,
    },
    qr: {
      type: String,
    },
    clicks: [{ type: Schema.Types.ObjectId, ref: "clicks" }],
  },
  { timestamps: true }
);

const URL = mongoose.model("urls", urlSchema);
module.exports = { URL };
