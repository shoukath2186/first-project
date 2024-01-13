const User = require('../model/userModel');
const bcrypt=require('bcrypt');

const randomstring=require('randomstring');
const config=require('../config/config')


const strongpass=async(password)=>{
    try {
        const passhass=await  bcrypt.hash(password,10);
        return passhass
    } catch (error) {
        console.log(error.message);
    }
}

//---------------email verification----------------

const nodemailer=require('nodemailer');

const sendVerifyMail=async(name,mail,user_id)=>{
   try {
      const transporter=nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:587,
        sequre:false,
        requireTLS:true,
        auth:{
            user:config.myEmail,
            pass:config.myPassword,
        }
        
      });
       const mailoption={
        from:config.myEmail,
        to:mail,
        subject:'for verification mail.',
        html:`<p>hii ${name}, please click here to <a href="http://localhost:5550/verify?id=${user_id}">verify </a> your mail.</p>`
       }
       transporter.sendMail(mailoption,function(error,info){
        if (error) {
            console.log(error);
        }else{
            console.log('email has been send:-',info.response);
        }
       })
       

   } catch (error) {
     console.log(error.message);
   }
}

//---------------timer----------------
async function setupOTPTimer(user_id) {
    let secondsRemaining =150;
    
  
    const countdownTimer = setInterval(() => {
      secondsRemaining -= 1;
  
      
  
      return secondsRemaining;
     
    }, 1000);
    setTimeout(() => {
      clearInterval(countdownTimer);
     
    }, 150000);


    
  }
  
  


//----------------otp---------------------

const sendotp=async(email,otp)=>{
    try {
       const transporter=nodemailer.createTransport({
         host:'smtp.gmail.com',
         port:587,
         sequre:false,
         requireTLS:true,
         auth:{
             user:config.myEmail,
             pass:config.myPassword,
         }
         
       });
        const mailoption={
         from:config.myEmail,
         to:email,
         subject:'Your otp.',
         html:`<h3>This is your OTP<h3><h1>${otp}<h1>`
        }
        transporter.sendMail(mailoption,function(error,info){
         if (error) {
             console.log(error);
         }else{
             console.log('email has been send:-',info.response);
         }
        })
        
 
    } catch (error) {
      console.log(error.message);
    }
 }



const userotpverification=async(req,res)=>{
    try {
        const otp = `${Math.floor(1000+Math.random()*9000)}`;

        
        return otp
        
    } catch (error) {
        console.log(error.message);
              
    }
}

//---------------------------


const insertUser = async (req, res) => {

    const strongpassword=await strongpass(req.body.password)
    
    const user = new User({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        password: strongpassword,
        is_admin:0,
        is_otp:false
    });


    const userData = await user.save();

    if (userData) {
        const otp=await userotpverification()
        const viting=await User.updateOne({_id:userData._id},{$set:{is_otp:true,is_sotp:false}});
        setupOTPTimer(userData._id);
        sendotp(userData.email,otp);
        
        res.render('otp',{message:'Sent your otp.',user_id:userData._id,motp:otp,resent:"Submit"});
    } else {
        res.render('registeration', { message: 'user registration faild' })
    }
}



const getingotp=async(req,res)=>{
    try {
        const otp=req.body.otp;
        const id=req.body.user_id;
        const motp=req.body.motp;
       
        const userdata=await User.findOne({_id:id});
        console.log(motp);
        if (userdata) {
            if(otp === motp&& userdata.is_otp==true){
                
                sendVerifyMail(userdata.name,userdata.email,userdata._id);
                const verifiy=await User.updateOne({_id:userdata._id},{$set:{is_sotp:true}})
                res.render("registeration",{message:"user registration has been successfully. Send verification mail. Check."})
            }else{

                res.render("otp",{message:"OTP is not match.",user_id:id,motp:motp,resent:"Submit" });

                
            }
        } else {
            res.render("otp",{message:"User phone number not valid",user_id:id,motp:motp,resent:"Submit"});
        }
    } catch (error) {
        console.log(error.message);
    }
}
//-----------------

 
const otpresend=async(req,res)=>{
    try {
        const gotp=await userotpverification();
        //const otp=req.body.otp;
        const id=req.body.user_id;
        //const motp=req.body.motp;
        const userdata=await User.findOne({_id:id});
        console.log(userdata);
        sendotp(userdata.email,gotp);
        setupOTPTimer(userdata._id);
        const viting=await User.updateOne({_id:userdata._id},{$set:{is_otp:true,is_sotp:false}});

        res.render('otp',{message:"Resend successful.",user_id:id,motp:gotp,resent:"Submit" });
        

    } catch (error) {
        console.log(error.message);
    }
}
//--------------


const mainpage = async (req, res) => {
    try {
        res.render("registeration");

    } catch (error) {
        console.log(error);

    }
}

const verifyMail=async(req,res)=>{
    try {
        console.log();
        const updateinfo=await User.updateOne({_id:req.query.id},{$set:{is_verified:1}})
        console.log(updateinfo);
        res.render("email-verified");
        
    } catch (error) {
        console.log(error.message);
        
    }
}
const loginload=async(req,res)=>{
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);
        
    }
}
const verifylogin=async(req,res)=>{
    try {
        const email=req.body.email;
        const password=req.body.password;
        const userdata=await User.findOne({email:email})
        if(userdata){
            const passwordmatch=await bcrypt.compare(password,userdata.password);
            if (passwordmatch) {
                if(userdata.is_verified===0){
                   res.render('login',{message:'please verify your mail.'})
                }else{
                    if(userdata.is_sotp===true);
                   req.session.user_id=userdata.id;
                   res.redirect("/home");
                }
                
            } else {
                res.render('login',{message:"Email and password is incorrect. "})
            }

        }else{
            res.render('login',{message:"Email and password is incorrect. "});
        }
        
    } catch (error) {
        console.log(error);
        
    }
}
const homepage=async(req,res)=>{
    try {
        const userData=await User.findById({_id:req.session.user_id});
        res.render('home',{user:userData});
    } catch (error) {
        console.log(error.message);
        
    }
}
const userlogout=async(req,res)=>{
    try {
        req.session.destroy();
        res.redirect('/');
    } catch (error) {
        console.log(error.message);
    }
}


//for reset passwerd sendmail


const sendresetpassword=async(name,mail,token)=>{
    try {
       const transporter=nodemailer.createTransport({
         host:'smtp.gmail.com',
         port:587,
         sequre:false,
         requireTLS:true,
         auth:{
             user:config.myEmail,
             pass:config.myPassword,
         }
         
       });
        const mailoption={
         from:config.myEmail,
         to:mail,
         subject:'for reset password.',
         html:`<p>hii ${name}, please click here to <a href="http://localhost:5550/forget-password?token=${token}"> Reset</a> your password.</p>`
        }
        transporter.sendMail(mailoption,function(error,info){
         if (error) {
             console.log(error);
         }else{
             console.log('email has been send:-',info.response);
         }
        })
        
 
    } catch (error) {
      console.log(error.message);
    }
 }
//forget password

const forgetLoad=async(req,res)=>{
    try {
        res.render('forget');
    } catch (error) {
        console.log(error.message);
        
    }
}
const forgetverify=async(req,res)=>{
    try {
        const email=req.body.email;
        const userdata=await User.findOne({email:email});
        if(userdata){
            
            if(userdata.is_verified===0){
                res.render("forget",{message:'please verify your mail.'})
            }else{
                const randomString=randomstring.generate();
                const updatedData=await User.updateOne({email:email},{$set:{token:randomString}});
                sendresetpassword(userdata.name,userdata.email,randomString);
                res.render('forget',{message:"plese check your mail to reset your password."})
            }
        }else{
            res.render('forget',{message:"User email  is incorrect."});
        }
    } catch (error) {
        console.log(error.message);
        
    }
}

const forgetpassword=async(req,res)=>{
    try {
        const token=req.query.token;
        const tokenData=await User.findOne({token:token})
        if(tokenData){
            res.render('forget-password',{user_id:tokenData._id});
        }else{
            res.render('404',{message:'Token is Valid.'});
        }

    } catch (error) {
        console.log(error.message);
        
    }
}

const resetpassword=async(req,res)=>{
    try {
        
        const password=req.body.password;
        const user_id=req.body.user_id;
        

        const sequre_password=await strongpass(password);

        const updateddata =await User.findByIdAndUpdate({_id:user_id},{$set:{password:sequre_password,token:''}})
        res.redirect('/')

    } catch (error) {
        console.log(error);
    }
}
//for verification send email link

const verificationLoad=async(req,res)=>{
    try {
        res.render('verification');
    } catch (error) {
        console.log(error.message);
        
    }
}
const sentVerificationLink =async(req,res)=>{
    try {
        const email=req.body.email;
        const userData=await User.findOne({email:email})
        if(userData){
            sendVerifyMail(userData.name,userData.email,userData._id);
            res.render('verification',{message:"Peset verification mail. send your mail id. please check."})
        }else{
            res.render('verification',{message:"This email is not exist."})
        }
    } catch (error) {
        console.log(error.message);
        
    }
}

  
module.exports = {
    mainpage,
    insertUser,
    getingotp,
    otpresend,
    verifyMail,
    loginload,
    verifylogin,
    homepage,
    userlogout,
    forgetLoad,
    forgetverify,
    forgetpassword,
    resetpassword,
    verificationLoad,
    sentVerificationLink
}
