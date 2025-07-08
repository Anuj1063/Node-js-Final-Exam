const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    bio: { type: String, default: "" },
    profilePic: { type: String, default: "" },
    isVerified:{type:Boolean,default:false},
    role: { type: String, enum: ["user", "admin"], default: "user" }, 
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
