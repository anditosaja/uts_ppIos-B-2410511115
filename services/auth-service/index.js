const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");

const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(session({
  secret: "oauth_secret",
  resave: false,
  saveUninitialized: true
}));

// routing utama
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Auth Service berjalan di port ${PORT}`);
});