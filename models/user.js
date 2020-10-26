const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwtSecretText = process.env.JWT_SECRET;
const schema = mongoose.Schema;
const userSchema = new schema({
  _id: String,
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
  ],
});
userSchema.methods.validatePassword = function (password) {
  let passwordIsValid = bcrypt.compareSync(password, this.password);
  return passwordIsValid;
};
userSchema.methods.toAuthJson = function () {
  let authorities = [];
  for (let i = 0; i < this.roles.length; i++) {
    authorities.push("ROLE_" + this.roles[i].name.toUpperCase());
  }
  return {
    id: this._id,
    username: this.username,
    roles: authorities,
    token: this.generateJwtToken(),
  };
};
userSchema.methods.generateJwtToken = function () {
  let today = new Date();
  let expDate = new Date();
  expDate.setDate(today.getDate() + 1);
  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      expDate: parseInt(expDate.getTime() / 1000, 10),
    },
    jwtSecretText
  );
};
module.exports = mongoose.model("user", userSchema);
