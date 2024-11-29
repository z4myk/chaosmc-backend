// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    
}
}, { 
 timestamps: true,
 versionKey: false,
}

);

userSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt);
}

userSchema.statics.comparePassword = async (password, receivedPassword) => {
 return await bcrypt.compare(password, receivedPassword)

}
module.exports = mongoose.model("User", userSchema);