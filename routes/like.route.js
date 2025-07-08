const router=require('express').Router()
const likeController=require('../controllers/like.controller')
const authCheck=require('../middleware/auth.middleware')()



router.post("   /:postId", authCheck.authenticateAPI, likeController.likePost);

module.exports=router