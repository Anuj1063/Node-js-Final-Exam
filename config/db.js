const mongoose=require('mongoose')

class DbConnect{

    async ConnectDb(){
        try {
            await mongoose.connect(process.env.MONGO_URI)
            console.log("MongoDB Conneccted !!!!")
            
        } catch (error) {
            console.log("Failed to Connect DB")
            throw error
        }
    }
}

module.exports=new DbConnect()
