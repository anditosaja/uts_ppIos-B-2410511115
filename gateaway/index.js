const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const verifyToken = require("./middleware/authMiddleware");
const axios = require("axios");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// middleware logging
const logRequest = async (req, res, next) => {
  try {
    await axios.post("http://localhost:3003/logs", {
      user: req.user?.email || "guest",
      action: "access",
      endpoint: req.originalUrl,
      method: req.method
    });
  } catch (err) {
    console.log("Log gagal dikirim");
  }

  next();
};

// public route
// login, register, oauth
app.use("/auth", createProxyMiddleware({
  target: "http://localhost:3001",
  changeOrigin: true
}));

//Protected route dengan jwt
// Inventory
app.use("/inventory", verifyToken, logRequest, createProxyMiddleware({
  target: "http://localhost:8080",
  changeOrigin: true,
   pathRewrite: {
    "^/inventory": "" 
  },
  onProxyReq: (proxyReq, req, res) => {
    if (req.body) {
      const bodyData = JSON.stringify(req.body);

      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));

      proxyReq.write(bodyData);
    }
  }
}));

// Log service
app.use("/log", verifyToken, createProxyMiddleware({
  target: "http://localhost:3003",
  changeOrigin: true
}));

// jalankan server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API Gateway berjalan di port ${PORT}`);
});