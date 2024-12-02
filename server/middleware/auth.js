const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header is missing" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(404).json({ error: "Token not found" });
  }
  jwt.verify(token, "your_secret_key", (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user.userId;
    next();
  });
};

module.exports = { auth };
