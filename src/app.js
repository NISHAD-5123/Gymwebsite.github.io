const { router } = require("express");
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const nodemailer = require("nodemailer");
const app = express();
let GlobalOtp;
require("./db/conn");
const data = require("./usercreadatials");
const Login = require("./model/login");
const Register = require("./model/registers");
const Paymentdetail = require("./model/payment");
const port = process.env.PORT || 5000;
const static_path = path.join(__dirname, "../public");
const templates_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", templates_path);
hbs.registerPartials(partials_path);


// nodemailer email verification
// app.post('/mail', async(req,res)=>{
  
// })







// making the API's
app.get("/",(req, res) => {
  // const login = await Login.findOne({}).sort({_id:-1}).limit(1);
  res.render("index"); 
});

app.get("/products", (req, res) => {
  res.render("product",{}); 
});

app.get("/aboutUs", (req, res) => {
  res.render("about"); 
});

app.get("/facilities", (req, res) => {
  res.render("facilities"); 
});

app.get("/register", (req, res) => {
  res.render("register"); //register
});

app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.cpassword;
    const email = req.body.email;
    const emailData = await Register.findOne({email:email})
    
    if(emailData){
      res.send("email is already exist");
    }

    else if (password === cpassword){
      // storing the data into database if the above if(condition) is true
      const registeremp = new Register({
        name: req.body.name,
        email:email,
        password: req.body.password,
        cpassword: req.body.cpassword,
        trainer:req.body.trainer,
        shift:req.body.shift,
      });
      const registered = await registeremp.save(); // stored data saved with this line
      console.log(registered);
      res.status(201).render("otpverify");
    }

    else {
      res.send(
      "Your password and confirm password does not matched !!"
    )
    }
  // const email = req.body.email;
  //email verify
  const OTP = Math.floor(Math.random()*9999+1);
  GlobalOtp = OTP;
  console.log(GlobalOtp);
  const mail = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure  : false,
    requireTLS:true,
    auth: {
      user:data.user,
      pass:data.password 
    }
  });
  mail.sendMail({
      from: data.user, // sender address
      to: email, // list of receivers
      subject: "Hello!!!", // Subject line
      html: `<h1>OTP IS ${OTP}</h1>`, // html body
    },(err)=>{
      if(err){
        console.log(err);
      }
      else{
        console.log("mailed successfully");
      }
  
    });

} catch (error) {
    res.send(error);
  }
});

app.post("/verify", async(req,res)=>{
  const val = req.body.otp;
  if(GlobalOtp == val){
    res.render("registered");
  }
  else{
    res.send("email is not verified");
  }
})



app.get("/admin" , async (req,res)=>{
  const userdata = await Register.find({ });  //fetching all data from Register model(table) from database
  const data = await Paymentdetail.find({ });  //fetching all data from paymentDetail model(table) from database
  console.log(userdata);
  res.render("admin",{userdata:userdata,paymentdetail:data}); //passing the data to admin.hbs file
})

app.get("/error", (req, res) => {
  res.render("error");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userdata = await Register.findOne({ email: email });

    if (userdata.password === password) {
      const LoginData = new Login({
        email : req.body.email,
        password:req.body.password,
      })
      const DataLogin = await LoginData.save();
      res.status(201).render("loggedin");
    } else {
      res.render("invalid login password or email does not matched!!");
    }
  } catch (error) {
    res.send(error);
  }
});

app.listen(port, () => {
  console.log(`server is running at the ${port}`);
});

app.get("/userPayment", (req,res)=>{
  res.render("payment");
})

app.get("/mydetails",async(req,res)=>{
  const mydata = await Register.findOne({}).sort({ _id: -1 }).limit(1);//finding the last records from total records in database
  // .then((data)=>{
  //   console.log(data);
  // }).catch((err)=>{
  //   console.log(err);
  // }); 
  const info = await Paymentdetail.findOne({}).sort({_id:-1}).limit(1);//finding the last records from total records in database
  res.render("mydetails",{userdata:mydata,data:info});
})

app.post('/userPayment', async(req,res)=>{
  try{
    const email=req.body.email;
    const password = req.body.password;
    const date = new Date();
    const currentDate = date.getDate();
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();

    const currentHour = (date.getHours());
    const currentMinute = (date.getMinutes());
    const currentSecond = (date.getSeconds());
    const dateTime = `${currentHour}:${currentMinute}:${currentSecond}`;
    const dateData = `${currentDate}-${currentMonth}-${currentYear} `;
  
    const userdatail = await Register.findOne({email:email});

    if(userdatail.password === password){
    const empl = new Paymentdetail({
    cardDetails:req.body.cardDetails,
    name:req.body.name,
    cvvNumber:req.body.cvvNumber,
    email:req.body.email,
    amount:req.body.amount,
    expiryMonth:req.body.month,
    time:dateTime,
    date:dateData,
    expiryYear:req.body.year,
    password:req.body.password,
    product:req.body.product,
    });
    const paymentsuccess= await empl.save();
    res.status(201).render("paymentsuccess");
  }
  else{
    res.send("error");
  }
}catch(error){
    res.status(400).send(error);
  }
})

  
  app.get("/payment",(req,res)=>{
    Paymentdetail.find().then((data)=>{
      res.json(data)    
    }).catch((err)=>{
      console.log(err);
    })
  })