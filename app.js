const express = require('express')
const UserRouter =require('./routes/user.routes')

const app = express()

app.set('view engine','ejs')

app.use('/user',UserRouter)






app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})

