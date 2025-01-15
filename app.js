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
        res.render("homepage")
    })
})
app.get("/logout",(req,res)=>{
    res.cookie("token","")
    res.render("signin")
})
app.get("/signin",(req,res)=>{
    res.render("signin")
})
app.post("/signin",async(req,res)=>{
    let {email,password} = req.body
    let user = await usermodel.findOne({email})  
    if(!user){
        res.render("signup")
    }
    bcrypt.compare(password,user.password,(err,result)=>{
        if(result){
            let token = jwt.sign({email:email,username:user.username},"hehe")
            res.cookie("token",token)
            res.render("homepage")
        }
        else{
            res.render("signin")
        }
    })
})
app.listen(port,()=>{
    console.log(`App is listening at ${port}`)
})
