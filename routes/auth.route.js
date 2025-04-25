const router=require('express').Router();
const authController=require('../controllers/auth.controller')
// const authCheck=require('../middleware/auth.middleware')


router.post('/signup',authController.signupUser);
router.post('/verify-otp',authController.verifyOtp);
router.post('/signin',authController.loginUser);


module.exports=router;
