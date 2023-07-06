const mongoose = require("mongoose");
const registrationSchema=new mongoose.Schema({
     name :{
      type:String,
      required:true  
    },
    email :{
        type:String,
        required:true,
        unique:true
    },
    password :{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    trainer:{
        type:String,
    },
    shift:{
        type:String,
    }
})

// collection
const Register=new mongoose.model("Register",registrationSchema);
module.exports=Register;