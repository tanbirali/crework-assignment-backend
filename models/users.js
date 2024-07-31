const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  fullname: { type: String, required: true, maxLength: 100 },
  createdAt: { type: Date },
});

const User = mongoose.model("user", userSchema);

module.exports = { User };
