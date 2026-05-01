const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); //hash password
const axios = require("axios"); // request ke Github

const {
  findUserByEmail,
  createUser
} = require("../models/userModel");

// Akses dan refresh token
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { email: user.email,  role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { email: user.email, role:user.role },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

// Register user baru
const register = async (req, res) => {
  const { email, password } = req.body;

  if (findUserByEmail(email)) {
    return res.status(409).json({ message: "User sudah ada" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = createUser({ email, password: hashed,  role: "user" });

  res.status(201).json(user);
};

// Login user
let refreshTokens = [];

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = findUserByEmail(email);
  if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Password salah" });

  const tokens = generateTokens(user);
   refreshTokens.push(tokens.refreshToken);

  res.json(tokens);
};

// Refresh akses token
const refreshToken = (req, res) => {
  const { token } = req.body;

  if (!refreshTokens.includes(token)) {
    return res.sendStatus(403);
  }

  jwt.verify(token, process.env.REFRESH_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = jwt.sign(
      { email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken });
  });
};

// Logout
const logout = (req, res) => {
  const { token } = req.body;

  refreshTokens = refreshTokens.filter(t => t !== token);

  res.json({ message: "Logout berhasil" });
};

// redirect ke Github OAuht
const githubLogin = (req, res) => {
  const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}
  &redirect_uri=${process.env.GITHUB_CALLBACK}&scope=user:email`;
  
  res.redirect(url);
};

// Callback dari github
const githubCallback = async (req, res) => {
  const code = req.query.code;

  try {
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code
      },
      { headers: { Accept: "application/json" } }
    );

    const access_token = tokenRes.data.access_token;

    // ambil data user githuv
    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const emailRes = await axios.get("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const email = emailRes.data[0].email;
    const name = userRes.data.name;
    const avatar = userRes.data.avatar_url;

    let user = findUserByEmail(email);

    if (!user) {
      user = createUser({ email, name, avatar, password: "oauth", provider: "github" });
    }

    const tokens = generateTokens(user);

    res.json(tokens);

  } catch (err) {
    res.status(500).json({ message: "OAuth gagal" });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  githubLogin,
  githubCallback
};