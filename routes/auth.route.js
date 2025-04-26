const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const authCheck=require('../middleware/auth.middleware')()
const profilerUploader = require("../helper/fileUpload");

const profileUpload = new profilerUploader({
  folderName: "uploads/profile",
  supportedFiles: ["image/jpeg", "image/png", "image/jpg"],
  fieldSize: 1024 * 1024 * 4,
});

router.post("/signup", profileUpload.upload().single('profilePic'),authController.signupUser);
router.post("/verify-otp", authController.verifyOtp);
router.post("/signin", authController.loginUser);
router.get('/details/:id',authCheck.authenticateAPI,authController.userDetails)
router.post('/update/:id',authCheck.authenticateAPI, profileUpload.upload().single('profilePic'),authController.updateUser)

module.exports = router;
