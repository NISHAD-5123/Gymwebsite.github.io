const mongoose = require("mongoose");
const emplSchema = new mongoose.Schema({
    cardDetails:{
        type:Number,  
    },
    name:{
        type:String,
        
    },
    cvvNumber:{
        type:Number,
    },
    password:{
        type:Number,
    },
    email:{
        type:String,
    
    },
    expiryMonth:{
        type:Number,
    },
    expiryYear:{
        type:Number,
    },
    amount:{
        type:Number,
    },
    product:{
        type:String,
    },
    date:{
        type:String,
    },
    time:{
        type:String,
    },
})
const Paymentdetail=new mongoose.model("Paymentdetail",emplSchema);
module.exports=Paymentdetail;