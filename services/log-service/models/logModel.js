const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  user: String,
  action: String,
  endpoint: String,
  method: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Log", logSchema);