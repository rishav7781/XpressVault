const express = require('express')
const UserRouter =require('./routes/user.routes')
const dotenv =require('dotenv')
const connectToDB = require('./config/db');
const cookieParser = require('cookie-parser');
connectToDB();

dotenv.config()
const app = express()

app.set('view engine','ejs')
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/user',UserRouter)






app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})

