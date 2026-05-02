require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');

const app = express();

// Konfigurasi Limit
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 menit
    max: 100, // Batas request
    message: "Terlalu banyak permintaan, coba lagi nanti."
});

app.use(limiter);

// Logging sederhana 
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] Incoming: ${req.method} ${req.url}`);
    next();
});

// AUTH SERVICE 
app.use('/auth', createProxyMiddleware({
    target: process.env.AUTH_SERVICE || 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: {
        '^/auth': '' 
    },
    
    onProxyReq: (proxyReq, req, res) => {
        console.log(`[Proxying] ${req.method} ${req.url} -> ${process.env.AUTH_SERVICE}${proxyReq.path}`);
    }
}));

// INVENTORY SERVICE 
app.use('/inventory', createProxyMiddleware({
    target: process.env.INVENTORY_SERVICE || 'http://localhost:8080',
    changeOrigin: true,
    pathRewrite: {
        '^/inventory': '' 
    },
    logLevel: 'debug'
}));

// LOG SERVICE
app.use('/logs', createProxyMiddleware({
    target: process.env.LOG_SERVICE || 'http://localhost:3003',
    changeOrigin: true,
    pathRewrite: {
        '^/logs': ''
    }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Gateway berjalan di port ${PORT}`);
});