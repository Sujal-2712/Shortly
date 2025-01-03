require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const { auth } = require("./middleware/auth");
const jwt = require("jsonwebtoken");
const { USER } = require("./model/user");
const { CLICKS } = require("./model/clicks");
const { URL } = require("./model/urls");
const cors = require("cors");
const multer = require("multer");
const nodemailer = require("nodemailer");

const UAParser = require("ua-parser-js");
const { config } = require("dotenv");

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/URL-SHORTNER").then(() => {
  console.log("Database connected");
});

app.get("/", async (req, res) => {
  res.json({ msg: "sujal" });
});

// Signup Route
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const existingUser = await USER.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new USER({ email, password: hashedPassword });
    await newUser.save();

    res.status(200).json({ message: "User registered successfully." });
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Login Route with JWT
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const user = await USER.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password." });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email, profile_img: user.profile_img },
      "your_secret_key",
      { expiresIn: "1h" }
    );
    res.status(200).json({
      token: token,
      profile_img: user.profile_img,
      email: user.email,
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

const generateShortUrl = () => {
  return shortid.generate();
};

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/shorten", auth, upload.single("qrCodeImage"), async (req, res) => {
  const { longUrl, customUrl, title } = req.body;
  const base64Image = req.file.buffer.toString("base64");
  const base64ImageWithPrefix = `data:image/png;base64,${base64Image}`;

  if (!longUrl) {
    return res.status(400).json({ message: "Original URL is required" });
  }

  try {
    const shortUrl = customUrl || generateShortUrl();

    const newUrl = new URL({
      original_url: longUrl,
      custom_url: customUrl ? customUrl.toLowerCase() : shortUrl,
      short_url: shortUrl,
      user_id: req.user,
      title: title || longUrl,
      qr: base64ImageWithPrefix,
    });

    await newUrl.save();

    await USER.findByIdAndUpdate(
      req.user,
      {
        $push: { urls: newUrl._id },
        $inc: { total_links: 1 },
      },
      { new: true }
    );

    res.status(201).json({
      message: "URL shortened successfully",
      data: {
        original_url: longUrl,
        short_url: shortUrl,
        qr: base64ImageWithPrefix,
        title: newUrl.title,
        customUrl: newUrl.custom_url,
        createdAt: newUrl.createdAt,
        _id: newUrl._id,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "Custom URL or Short URL already exists" });
    }
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

app.get("/user-urls", auth, async (req, res) => {
  try {
    const userId = req.user;
    const userUrls = await URL.find({ user_id: userId }).populate({
      path: "clicks",
      select: "city device country",
    });
    res.status(200).json({
      message: "URLs fetched successfully",
      data: userUrls,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch URLs",
      error: err.message,
    });
  }
});

app.get("/get-url/:id", auth, async (req, res) => {
  const id = req.params.id;
  try {
    const result = await URL.find({ _id: id }).populate(
      "clicks",
      "city device country"
    );
    return res
      .status(200)
      .json({ message: "URL fetched Sucessfully", data: result });
  } catch (error) {}
});

app.delete("/delete-url/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedURL = await URL.findOneAndDelete({ _id: id });
    if (!deletedURL) {
      return res.status(404).json({ message: "URL not found" });
    }
    const user = await USER.findById({ _id: req.user });
    const newTotalLinks = Math.max(0, (user.total_links || 0) - 1);

    await USER.findByIdAndUpdate(
      req.user,
      {
        $pull: { urls: id },
        $set: { total_links: newTotalLinks },
      },
      { new: true }
    ).then((res) => {});

    res.status(200).json({ message: "URL deleted successfully", deletedURL });
  } catch (err) {
    console.error("Error while deleting URL:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const parser = new UAParser();

app.get("/get-long-url/:short_url", async (req, res) => {
  const short_url = req.params.short_url;
  try {
    const urlData = await URL.findOne({ short_url }).select("_id original_url");
    if (!urlData) return res.status(404).json({ message: "URL not found" });

    await Promise.all([
      storeClicks(urlData._id),
      res
        .status(200)
        .json({ id: urlData._id, original_url: urlData.original_url }),
    ]);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching the URL" });
  }
});

const storeClicks = async (id) => {
  try {
    const device = parser.getResult().type || "desktop";
    const geoDataPromise = fetch("https://ipapi.co/json").then((response) =>
      response.json()
    );
    const { city, country_name: country } = await geoDataPromise;
    const clicks = new CLICKS({
      url_id: id,
      city,
      device,
      country,
    });
    const savedClick = await clicks.save();
    await URL.findByIdAndUpdate(
      id,
      { $push: { clicks: savedClick._id } },
      { new: true }
    );
  } catch (error) {
    console.log(error);
  }
};

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await USER.findOne({ email: email });
  if (!user) return res.status(404).json({ error: "User not found" });
  const otp = Math.floor(100000 + Math.random() * 900000);
  user.reset_password_otp = otp;
  user.reset_password_otp_expires = Date.now() + 10 * 60 * 1000;
  await user.save();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    to: user.email,
    from: process.env.EMAIL,
    subject: "Password Reset OTP",
    text: `Your password reset OTP is: ${otp}. It is valid for 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
  res.status(200).json({
    message: "OTP sent to your email",
    otp,
    expires: user.reset_password_otp_expires,
  });
});

app.post("/reset-password", auth, async (req, res) => {
  try {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await USER.findOne({ _id: req.user });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    user.password = hashedPassword;
    await user.save();
    return res
      .status(200)
      .json({ message: "Password reset successfully.", success: true });
  } catch (error) {
    console.error("Password reset failed:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while resetting the password." });
  }
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
