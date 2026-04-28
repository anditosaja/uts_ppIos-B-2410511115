const jwt = require("jsonwebtoken");

// validasi JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // cek header
  if (!authHeader) {
    return res.status(401).json({ message: "Token tidak ada" });
  }

  const token = authHeader.split(" ")[1];

  // verifikasi token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token tidak valid" });
    }

    req.user = user; // simpan user
    next();
  });
};

module.exports = verifyToken;