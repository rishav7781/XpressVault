const express=require("express")
const router= express.Router();
const {body, validationResult} = require('express-validator')






router.get('/register',(req,res)=>{
    res.render('register')
})

router.post('/register',
   [ body('email').trim().isEmail().isLength({min:13}).withMessage('Invalid email format'),
    body('username')
      .trim()
      .isLength({ min: 5 })
      .withMessage('Username must be at least 5 characters long'),
    body('password')
      .trim()
      .isLength({ min: 5 })
      .withMessage('Password must be at least 5 characters long'),],
    (req,res)=>{

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
             return res.status(400).json({ errors: errors.array() });}

        console.log(req.body)
        res.send("User Registered")

})


module.exports=router