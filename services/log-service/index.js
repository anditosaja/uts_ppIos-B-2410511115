const express = require("express");
const mysql = require("mysql2");
const app = express();
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "log_db"
});

db.connect((err) => {
  if (err) console.error("MySQL Gagal:", err);
  else console.log("MySQL Connected!");
});

// POST simpan log
app.post("/logs", (req, res) => {
  const { user, action, endpoint, method } = req.body;
  const sql = "INSERT INTO activity_logs (user, action, endpoint, method) VALUES (?, ?, ?, ?)";
  db.query(sql, [user, action, endpoint, method], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Log tersimpan di MySQL" });
  });
});

// GET log
app.get("/", (req, res) => {
  db.query("SELECT * FROM activity_logs ORDER BY timestamp DESC LIMIT 50", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.listen(3003, () => console.log("Log Service berjalan di 3003"));