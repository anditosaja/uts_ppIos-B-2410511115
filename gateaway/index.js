const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const verifyToken = require("./middleware/authMiddleware");
const checkRole = require("./middleware/roleMiddleware");
const rateLimit = require("express-rate-limit");
const axios = require("axios");

require("dotenv").config();

const app = express();

// Konfigurasi
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Konfigurasi rate limit
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60
});
app.use(limiter);

//logging otomatis
const logRequest = (req, res, next) => {
  next(); 

  // Skip logging 
  if (!(req.method === "POST" && req.originalUrl.includes("/inventory"))) {
    axios.post("http://localhost:3003/logs", {
      user: req.user?.email || "guest",
      action: "access",
      endpoint: req.originalUrl,
      method: req.method
    }, { timeout: 500 }).catch(() => {
      
    });
  }
};

// routh auth
app.use("/auth", createProxyMiddleware({
  target: "http://localhost:3001",
  changeOrigin: true,
  family: 4, 
  onProxyReq: (proxyReq, req, res) => {
   
    if (req.body && Object.keys(req.body).length > 0) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  }
}));

//routh inventory
// DELETE Role Admin
app.delete(
  "/inventory/barang/:id",
  verifyToken,
  checkRole("admin"),
  createProxyMiddleware({
    target: "http://localhost:8080",
    changeOrigin: true,
    family: 4, // Memaksa IPv4 untuk mempercepat koneksi localhost
    pathRewrite: { "^/inventory": "" }
  })
);

// Endpoint GET, POST, PUT
app.use("/inventory", verifyToken, logRequest, createProxyMiddleware({
  target: "http://localhost:8080",
  changeOrigin: true,
  pathRewrite: { "^/inventory": "" },
  family: 4, // Mencegah delay pencarian IPv6 
  onProxyReq: (proxyReq, req, res) => {
    
    if (req.body && Object.keys(req.body).length > 0) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    // Logging internal gateway 
    console.log(`Inventory Responded: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error("Gateway Error:", err.message);
    res.status(504).json({ message: "Inventory-service Timeout atau Offline" });
  }
}));

//rout logs
app.use("/logs", verifyToken, createProxyMiddleware({
  target: "http://localhost:3003",
  changeOrigin: true,
  family: 4, // Konsistensi IPv4 pada localhost
  pathRewrite: { "^/logs": "" }
}));

// routh utama
app.get("/", (req, res) => {
  res.send("API Gateway Running");
});

// jalankan
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API Gateway berjalan di port ${PORT}`);
});