const mg = require("mongoose");

const userSchema = mg.Schema({
  name: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  balance: { type: Number, required: true },
  initialBalance: { type: Number, required: true },
  aadhar: { type: Number, required: true },
  pan: { type: String, required: true },
});

const userModel = mg.model("user", userSchema);

module.exports = userModel;
