require('dotenv').config()
const db=require('./config/db')
const express=require('express')

const app=express()

app.use(express.urlencoded({extended:true}))
app.use(express.json())





app.use('/api/auth',require('./routes/auth.route'))
app.use('/api/user',require('./routes/user.route'))
app.use('/api/user/category',require('./routes/category.route'))
app.use('/api/user/post',require('./routes/post.route'))
app.use('/api/user/like',require('./routes/like.route'))
app.use('/api/user/comment',require('./routes/comment.route'))




app.listen(process.env.PORT,()=>{
    console.log(`Server is Running On http://127.0.0.1:${process.env.PORT}`)
    db.ConnectDb();

})