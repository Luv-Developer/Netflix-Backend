const mongoose = require("mongoose")
const connection = mongoose.connect("mongodb://0.0.0.0/Netflix").then(()=>{
    console.log("Database Connected")
})
module.exports = connection