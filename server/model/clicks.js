const mongoose = require("mongoose");
const { Schema } = mongoose; // Import Schema from mongoose

const clickSchema = new Schema({
  url_id: {
    type: Schema.Types.ObjectId,
    ref: "urls",
    required: true,
  },
  city: {
    type: String,
    required: true,
    lowercase: true,
  },
  device: {
    type: String,
    required: true,
    lowercase: true,
  },
  country: {
    type: String,
    required: true,
    lowercase: true,
  },
});

const CLICKS = mongoose.model("clicks", clickSchema);
module.exports = { CLICKS };
