const router=require('express').Router()
const categoryController=require('../controllers/category.controller')
const authCheck=require('../middleware/auth.middleware')()



router.post("/create",authCheck.authenticateAPI,categoryController.addCategory)
router.get("/list",authCheck.authenticateAPI,categoryController.listCategoriesWithPosts)

module.exports=router