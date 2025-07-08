const router=require('express').Router()
const commentController=require('../controllers/comment.controller')
const authCheck=require('../middleware/auth.middleware')()

router.post(
  "/:postId",
  authCheck.authenticateAPI,
  commentController.commentOnPost
);



module.exports=router