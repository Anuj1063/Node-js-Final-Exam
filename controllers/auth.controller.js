const userModel = require("../models/user.model");

const sendEmailVerificationOTP = require("../helper/emailOtpVerify");

const emailVerifyModel = require("../models/otp.model");


const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



class AuthController {
  async signupUser(req, res) {
    try {
      const { firstName,lastName,bio, password, email } = req.body;
 
      const profilePic = req.file.filename;

      const hasedPassword = await bcrypt.hash(password, 10);

      if (!firstName ||!lastName||!bio|| !password || !email || !profilePic) {
        deleteFile("uploads/profile", profilePic);
        return res.status(400).json({
          success: false,
          message: "All Feild Required",
        });
      }

      let isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        deleteFile("uploads/profile", profilePic);
        return res.status(400).json({
          success: false,
          message: "Email Already Exists",
        });
      }

     
      let user = await userModel.create({
        firstName,
        lastName,
        password: hasedPassword,
        email,
        bio,
        profilePic,
      });
     
      
      sendEmailVerificationOTP(user);

      if (user) {
        return res.status(200).json({
          success: true,
          message: "User Created Successfully",
          user
        });
      }
    } catch (error) {
      console.error("Error in createUser:", error);
      deleteFile("uploads/profile", profilePic);
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again.",
      });
    }
  }

  async verifyOtp(req, res) {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res.status(400).json({
          status: false,
          message: "All fields are required",
        });
      }

      const existingUser = await userModel.findOne({ email });
      if (!existingUser) {
        return res.status(404).json({
          status: false,
          message: "Email doesn't exist",
        });
      }

      if (existingUser.isVerified) {
        return res.status(400).json({
          status: false,
          message: "Email is already verified",
        });
      }

      const emailVerification = await emailVerifyModel.findOne({
        userId: existingUser._id,
        otp,
      });

      if (!emailVerification) {
        return res.status(400).json({
          status: false,
          message: "Invalid OTP",
        });
      }

      existingUser.isVerified = true;
      await existingUser.save();

      await emailVerifyModel.deleteMany({ userId: existingUser._id });

      return res.status(200).json({
        status: true,
        message: "Email verified successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: "Unable to verify email, please try again later",
      });
    }
  }

  async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          status: false,
          message: "All Feild Required",
        });
      }
      let user = await userModel.findOne({ email, isDeleted: false });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }
      if (!user.isVerified) {
        return res
          .status(401)
          .json({ status: false, message: "Your account is not verified" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName:user.lastName,
          email: user.email,
          bio:user.bio

        },
      });
    } catch (e) {
      console.error("Error in loginUser:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

 
}

module.exports = new AuthController();
