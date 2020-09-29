const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    confirmed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

schema.virtual("password").set(function (password) {
  this.passwordHash = bcrypt.hashSync(password, 10);
});

schema.methods = {
  authenticate: function (password) {
    return bcrypt.compareSync(password, this.passwordHash);
  },
};

schema.methods.setConfirmationToken = function setConfirmationToken() {
  this.confirmationToken = this.generateJWT();
};

schema.methods.generateJWT = function generateJWT() {
  return jwt.sign(
    {
      email: this.email,
      confirmed: this.confirmed,
    },
    process.env.JWT_SECRET
  );
};

schema.methods.toAuthJSON = function toAuthJSON() {
  return {
    email: this.email,
    username: this.username,
    confirmed: this.confirmed,
    token: this.generateJWT(),
  };
};

module.exports = mongoose.model("User", schema);
