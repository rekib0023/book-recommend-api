const express = require("express");
const env = require("dotenv");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// routes
const authRoutes = require("./routes/auth");

env.config();
const port = process.env.PORT;

// mongodb connection
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Database connected");
  });

app.use(bodyParser.json());
app.use("/api", authRoutes);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => console.log(`Running on localhost:${port}`));
