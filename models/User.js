const { Schema, model } = require("mongoose");

const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    minLength: 3,
    maxLength: 50,
  },
  username: {
    type: String,
    required: [true, "Please provide a username"],
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide a email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: 6,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  favoriteSport: {
    type: [String],
    enum: ["paintball", "airsoft", "laser tag"],
    default: ["paintball"],
  },
});

UserSchema.pre("save", async function () {
  if (!this.isModified('password'))return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (loginPassword){
  const isMatch= await bcrypt.compare(loginPassword,this.password);
  return isMatch;
}

module.exports = model("User", UserSchema);
