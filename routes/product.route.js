    const router=require('express').Router()
    const productController=require('../controllers/product.controller')

    const authCheck=require('../middleware/auth.middleware')()



    router.post("/create",authCheck.authenticateAPI,productController.createProduct)
    router.get("/list",authCheck.authenticateAPI,productController.productList)
    router.post("/update/:id",authCheck.authenticateAPI,productController.updateProduct)
    router.post("/delete/:id",authCheck.authenticateAPI,productController.deleteProduct)
    router.get("/stocks",authCheck.authenticateAPI,productController.lessStocks)


    module.exports=router