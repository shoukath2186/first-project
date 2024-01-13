const express=require('express');
const routing=express()
const bodyparser=require('body-parser');


const session=require('express-session');

const config=require('../config/config');
routing.use(session({secret:config.sessionSecret}))

const auth=require('../auth/auth')


routing.use(bodyparser.json())
routing.use(bodyparser.urlencoded({extended:true}));

const controller=require('../controller/userController');

routing.set('view engine','ejs');


routing.get("/register",auth.islogout,controller.mainpage)
routing.post("/register",auth.islogout,controller.insertUser);

routing.post('/otpverification',auth.islogout,controller.getingotp);
routing.post("/otpresend",auth.islogout,controller.otpresend);

routing.get('/verify',controller.verifyMail)

routing.get('/',auth.islogout,controller.loginload);
routing.get('/login',auth.islogout,controller.loginload);

routing.post('/login',controller.verifylogin);

routing.get('/home',auth.islogin,controller.homepage);
//--------------------
routing.get('/logout',auth.islogin,controller.userlogout);

routing.get('/forget',auth.islogout,controller.forgetLoad);
routing.post('/forget',controller.forgetverify);

routing.get('/forget-password',auth.islogout,controller.forgetpassword);

routing.post('/forget-password',controller.resetpassword);

routing.get('/verification',controller.verificationLoad);
routing.post('/verification',controller.sentVerificationLink)

module.exports=routing