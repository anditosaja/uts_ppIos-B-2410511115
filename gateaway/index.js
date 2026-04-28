const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const verifyToken = require("./middleware/authMiddleware");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// public route
// login, register, oauth
app.use("/auth", createProxyMiddleware({
  target: "http://localhost:3001",
  changeOrigin: true
}));


//Protected route dengan jwt
// Inventory
app.use("/inventory", verifyToken, createProxyMiddleware({
  target: "http://localhost:8080",
  changeOrigin: true
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