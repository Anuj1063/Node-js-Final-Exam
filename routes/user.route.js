const router = require("express").Router();
const userController = require("../controllers/user.controller");
const authCheck=require('../middleware/auth.middleware')()
const profilerUploader = require("../helper/fileUpload");

const profileUpload = new profilerUploader({
  folderName: "uploads/profile",
  supportedFiles: ["image/jpeg", "image/png", "image/jpg"],
  fieldSize: 1024 * 1024 * 4,
});


router.get('/details',authCheck.authenticateAPI,userController.userDetails)
router.put('/update',authCheck.authenticateAPI, profileUpload.upload().single('profilePic'),userController.updateProfile)

module.exports = router;
