const express = require("express");
const mongoose = require("mongoose");
const Log = require("./models/logModel");

const app = express();
app.use(express.json());

// koneksi MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/logdb");

// tambah log
app.post("/logs", async (req, res) => {
  const log = new Log(req.body);
  await log.save();
  res.json({ message: "Log tersimpan" });
});

// ambil log
app.get("/logs", async (req, res) => {
  const logs = await Log.find();
  res.json(logs);
});

app.listen(3003, () => {
  console.log("Log service jalan di 3003");
});