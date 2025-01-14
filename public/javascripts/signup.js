const x = document.getElementById("myinput")
const myfunction = () =>{
    if(x.type==="password"){
        x.type = "text"
    }
    else{
        x.type  = "password"
    }
}