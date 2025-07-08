const userModel=require('../models/user.model')
const deleteFile = require("../helper/deleteFile");


class UserController{
 async userDetails(req, res) {
    try {
      const userId=req.user._id

      let user = await userModel.findOne({ _id: userId,isDeleted:false }).select("-password -_id -isDeleted  -createdAt -updatedAt")

      if (user) {
        return res.status(200).json({
          status: true,
          message: "User Details Fetched Successfully",
          user
        });
      }
    } catch (err) {
      console.log("Server Error", err);
    }
  }
async updateProfile(req, res) {
    try {
      const user = req.user;
    
      const existingUser = await userModel.findOne({
        _id: user._id,
        isDeleted: false,
      });

      if (!existingUser) {
        return res.status(404).send({
          status: 404,
          data: {},
          message: "User not found",
        });
      }

      const body = req.body || {};
    
      let updateData = {};

      if (body.firstName) {
        updateData.firstName = body.firstName.trim();
      }

      if (body.lastName) {
        updateData.lastName = body.lastName.trim();
      }

      if (body.bio) {
        updateData.bio = body.bio.trim();
      }

      if (body.email && body.email !== existingUser.email) {
        const emailExists = await userModel.findOne({
          email: body.email,
          isDeleted: false,
        });
        if (emailExists) {
          deleteFile("uploads/profile",req.file.filename);
          return res.status(400).send({
            status: 400,
            data: {},
            message: "Email is already taken",
          });
        }
        updateData.email = body.email.trim();
      }

      if (req.file) {
    
        deleteFile("uploads/profile", user.profilePic);
        updateData.profilePic = req.file.filename;
      }
      
      if (Object.keys(updateData).length === 0) {
        return res.status(200).send({
          status: 200,
          data: {},
          message: "No changes were made. Profile is already up-to-date.",
        });
      }

      const updatedUser = await userModel.findByIdAndUpdate(
        user._id,
        { $set: updateData },
        { new: true }
      ).select("-password -_id -isDeleted  -createdAt -updatedAt");

      return res.status(200).send({
        status: 200,
        data: updatedUser,
        message: "Profile updated successfully!",
      });
    } catch (err) {
      deleteFile("uploads/profile", user.profilePic);
      return res.status(500).send({
        status: 500,
        data: {},
        message: err.message,
      });
    }
  }


}

module.exports=new UserController()