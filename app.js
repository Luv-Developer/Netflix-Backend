const express = require("express")
const app = express()
const port = 3000
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const path = require("path")
const usermodel = require("./model/user")
const connection = require("./config/connection")
const cookieParser = require("cookie-parser")
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")))
app.set("view engine","ejs")
app.get("/",(req,res)=>{
    res.render("homepage")
})
app.get("/signup",(req,res)=>{
    res.render("signup")
})
app.post("/signup",async(req,res)=>{
    let {username,email,password} = req.body 
    let user = await usermodel.findOne({username})
    if(user){
        res.send("User already exist")
    }
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async(err,hash)=>{
            let user = await usermodel.create({
                username,
                email,
                password:hash  
            })
        })
        let token = jwt.sign({email:email,username:username},"hehe")
        res.cookie("token",token)
        res.send("Data Saved")
    })
})
app.listen(port,()=>{
    console.log(`App is listening at ${port}`)
})
