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
// mongodb+srv://rkb0023:<password>@cluster0.alocm.mongodb.net/<dbname>?retryWrites=true&w=majority
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.alocm.mongodb.net/${process.env.MONGO_DB_DATABSE}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }
  )
  .then(() => {
    console.log("Database connected");
  });

app.use(bodyParser.json());
app.use("/api", authRoutes);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => console.log(`Running on port:${port}`));
