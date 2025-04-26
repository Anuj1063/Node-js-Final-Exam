const mongoose=require('mongoose')

const categorySchema=new mongoose.Schema({
    name:{type:String,required:true},
    isDeleted:{type:Boolean,default:false}
    
},{timestamps:true,versionKey:false})

module.exports=mongoose.model("category",categorySchema)
