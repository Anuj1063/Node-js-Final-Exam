require('dotenv').config()
const db=require('./config/db')
const express=require('express')

const app=express()

app.use(express.urlencoded({extended:true}))
app.use(express.json())



// app.use((req, res, next) => {
//     let auth = require('./middlewares/auth')(req, res, next)
//     app.use(auth.initialize());
//     if (req.session.token && req.session.token != null) {
//         req.headers['token'] = req.session.token;
//     }
//     res.locals.success_message = req.flash("success");
//     res.locals.error_message = req.flash("error");
//     next();
// });

app.use('/api/user',require('./routes/auth.route'))




app.listen(process.env.PORT,()=>{
    console.log(`Server is Running On http://127.0.0.1:${process.env.PORT}`)
    db.ConnectDb();

})