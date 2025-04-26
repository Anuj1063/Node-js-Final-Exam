const mongoose=require('mongoose')

const productSchema=new mongoose.Schema({
    categoryId:{type:mongoose.Schema.Types.ObjectId,ref:"category",required:[true,"category Id is Required"]},
    name:{type:String,required:true},
    price:{type:Number,required:true},
    stocks:{type:Number,required:true},
    isDeleted:{type:Boolean,default:false}
},{timestamps:true,versionKey:false})

module.exports=mongoose.model("product",productSchema)
