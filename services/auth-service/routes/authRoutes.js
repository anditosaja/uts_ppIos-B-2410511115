const express = require("express");
const router = express.Router();

const {
  register,
  login,
  refreshToken,
  logout,
  githubLogin,
  githubCallback
} = require("../controllers/authController");

// Endpoint uAuth
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

// Endpoint Oauth Github
router.get("/github", githubLogin);
router.get("/github/callback", githubCallback);

module.exports = router;