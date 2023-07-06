const mongoose = require("mongoose");
const loginSchema = new mongoose.Schema({
    email:{
        type:String,

    },
    password:{
        type:String,
    }
});
const Login = new mongoose.model("Login" , loginSchema);
module.exports = Login;