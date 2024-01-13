const User=require('../model/userModel');
const mongoose = require('mongoose')
const bcrypt=require("bcrypt");


const userids=require('../config/config')

const nodemailer=require("nodemailer");
const randomstrng=require('randomstring');

const Product=require('../model/productModel');

const Category=require('../model/categoryMode');


//-------------------------------------------------------------------


function isStrongPassword(password) {
    // Minimum length requirement
    if (password.length < 8) {
        return false;
    }

    // Check for uppercase and lowercase letters
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
        return false;
    }

    // Check for at least one numeric digit
    if (!/\d/.test(password)) {
        return false;
    }

    // Check for at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return false;
    }

    // All criteria passed
    return true;
}



const securePassword=async(password1)=>{
    try {
        const passwordHash=await bcrypt.hash(password1,10);
          return passwordHash
        
    } catch (error) {
        console.log(error.message);
    }
}

//-----------------------email verification-------

// const sendVerificationMail=async(name,email,user_id)=>{
//     try {
//         const transporter=nodemailer.createTransport({
//             host:'smtp.gmail.com',
//             port:587,
//             secure:false,
//             auth:{
//                 user:userids.useremail,
//                 pass:userids.userpassword,
//             }
//         });
//         const mailoption={
//             from:userids.useremail,
//             to:email,
//             subject:"for verification mail",
//             html:`<p>hii ${name}, please click here to <a href="http://localhost:9999/verify?id=${user_id}">verify </a> your mail.</p>`
//         }
//         transporter.sendMail(mailoption,(error,info)=>{
//             if (error) {
//                 console.log(error);
//             } else {
//                 console.log("Email has been sent:-",info.response);
//             }
//         })
//     } catch (error) {
//         console.log(error.message);
        
//     }
// }

//-------------otp cerification----------------

const sendotp=async(email,otp)=>{
    try {
       const transporter=nodemailer.createTransport({
         host:'smtp.gmail.com',
         port:587,
         sequre:false,
         requireTLS:true,
         auth:{
             user:userids.useremail,
             pass:userids.userpassword,
         }
         
       });
        const mailoption={
         from:userids.useremail,
         to:email,
         subject:'Your otp.',
         html:`<h3>This is your OTP.<h3><h1>${otp}<h1>`
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
//------------otp generator----------

const userotpverification=async()=>{
    try {
        const otp = `${Math.floor(1000+Math.random()*9000)}`;

        
        return otp
        
    } catch (error) {
        console.log(error.message);
              
    }
}

//------------otp timer----------------
async function setupOTPTimer() {
    let secondsRemaining =150;
    
  
    const countdownTimer = setInterval(() => {
      secondsRemaining -= 1;
  
      
  
      //return secondsRemaining;
     
    }, 1000);
    setTimeout(() => {
      clearInterval(countdownTimer);
     
    }, 150000);


    
  }
//------------------

const registerpage=async(req,res)=>{
    try {
        res.render("register")
    } catch (error) {
        console.log(error.message);
    }
}

const Joi = require('joi');

// Define schema for email
const emailSchema = Joi.string().email().required();

// Define schema for name
const nameSchema = Joi.string().min(3).max(30).required();




const getregister=async(req,res)=>{
    try {


        const { error: emailError } = emailSchema.validate(req.body.email);
    if (emailError) {
        return res.render('register', { messageemil: emailError.details[0].message,email:req.body.email,name:req.body.name,
            phone:req.body.Phone,password1:req.body.password1,password2:req.body.password2 });
    }


    // Validate name
    const { error: nameError } = nameSchema.validate(req.body.name);
    if (nameError) {
        return res.render('register', { messagename: nameError.details[0].message,email:req.body.email,name:req.body.name,
            phone:req.body.Phone,password1:req.body.password1,password2:req.body.password2 });
    }

    if(req.body.Phone.length !== 10){
        return res.render("register",{messagepon:"Need 10 number.",email:req.body.email,name:req.body.name,
        phone:req.body.Phone,password1:req.body.password1,password2:req.body.password2 });
    }
    const isPasswordStrong = isStrongPassword(req.body.password1);
    if(isPasswordStrong == false){
       return res.render("register",{messagepass:"Password is not strong enough(Strong@123).",email:req.body.email,name:req.body.name,
       phone:req.body.Phone,password1:req.body.password1,password2:req.body.password2 });
    }




        

       if(req.body.password1 == req.body.password2){
        const password=await securePassword(req.body.password1);
        const user=new User({
            name:req.body.name,
            mobile:req.body.Phone,
            email:req.body.email,
            password:password,
            is_admin:0,
            blocked:false,
            is_otp:false,
        })
    
        const userData=await user.save()
        
        
        if (userData) {
            const otp=await userotpverification();
            
            //setupOTPTimer();
            const viting=await User.updateOne({_id:userData._id},{$set:{is_otp:true}});
            sendotp(userData.email,otp);

            res.render('otpPage',{message:'Send your otp.',user_id:userData._id,ootp:otp,resent:"Submit"})
        } else {
            res.render("register",{message:"User registration faild"});
        }
          
          
       }else{

        res.render("register",{messagepass:"Password not match.",email:req.body.email,name:req.body.name,
        phone:req.body.Phone,password1:req.body.password1,password2:req.body.password2 });
        
        }
    } catch (error) {
        console.log(error.message);
        
    }
}
//----------------otp controller------------

const getinotp=async(req,res)=>{
    try {
        const otp=req.body.otp;
        const id=req.body.user_id;
        const motp=req.body.motp;
        
        const userdata=await User.findOne({_id:id});
        if (userdata) {
            
            if(userdata.is_otp == true&& otp == motp ){
                

                const a=await User.updateOne({_id:id},{$set:{otp_verify:true}});
                
               // sendVerificationMail(userdata.name,userdata.email,userdata._id);
                
                res.render("login",{message:"user registration has been successfully."})
            }else{

                res.render("otpPage",{message:"OTP is not match.",user_id:id,ootp:motp,resent:"Submit" });

                
            }
        } else {
            res.render("otpPage",{message:"User phone number not valid",user_id:id,ootp:motp,resent:"Submit"});
        }

        
    } catch (error) {
        console.log(error.message);
        
    }
}
const otpresend=async(req,res)=>{
    try {
        const gotp=await userotpverification();
        const id=req.body.user_id;
        const userdata=await User.findOne({_id:id})
        sendotp(userdata.email,gotp);
        setupOTPTimer();
        await User.updateOne({_id:userdata._id},{$set:{is_otp:true}});
        res.render('otpPage',{message:"Resend successful.",user_id:id,ootp:gotp,resent:"Submit" });
    } catch (error) {
        console.log(error.message);
    }

}

//---------------
const mailverify=async(req,res)=>{
    try {
        const updateInfo=await User.updateOne({_id:req.query.id},{$set:{is_varified:1}});
        console.log(updateInfo);
        res.render('email-verification');
    } catch (error) {
        console.log(error.message);
        
    }
}
//---------login page--------------
const loginload=async(req,res)=>{
    try {
        res.render("login");
    } catch (error) {
        console.log(error.message);
        
    }
}
const verifylogin=async(req,res)=>{
    try {
        const email=req.body.email;
        const password=req.body.password;
        const userdata=await User.findOne({email:email});
        if (userdata) {
            const passwordmatch=await bcrypt.compare(password,userdata.password)
        if(passwordmatch){

          if (userdata.blocked==false) {

            if(userdata.otp_verify === false){
               res.render('login',{message:'Please veryify your otp.'})
            }else{
                 req.session.user_id=userdata._id;
                 res.render('index',{user_id:userdata});
            }
        }else{
            res.render('login',{message:'User is blocked.'});
        }
        }else{
            res.render('login',{message:'password not matched.'})
        }

            
        } else {
            res.render('login',{message:"Email is incorrect."})
        }
    } catch (error) {
        console.log(error.message);
        
    }
}

const verifyemailload=async(req,res)=>{
    try {
        res.render('verifyemail')
    } catch (error) {
        console.log(error.message);
        
    }
}

const verifyemail=async(req,res)=>{
    try {
        const mail=req.body.email;
        const userdata=await User.findOne({email:mail})
        if(userdata){
            res.render('login',{message:'User already exist.'})
        }else{
            res.render('verifyemail',{message:'User not found.'})
        }

    } catch (error) {
        console.log(error.message);
    }
}


//---------home--------




const loadehome=async(req,res)=>{
    try {
        const userdata=await User.findOne({_id:req.session.user_id});
     res.render("index",{user_id:userdata});
    } catch (error) {
        console.log(error.message);
        
    }
}
//
const userlogout=async(req,res)=>{
    try {
        
        req.session.destroy();
        
        res.render('login',{message:'Logout success fully.'});
    } catch (error) {
        console.log(error.message);
    }
}

//---------forgetpassword----------

const forgetload=async(req,res)=>{
    try {
        res.render('forget');
    } catch (error) {
        console.log(error.message);
        
    }
}

//----------------
const sendVerificationpassword=async(name,email,token)=>{
    try {
        
        const transporter=nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            auth:{
                user:userids.useremail,
                pass:userids.userpassword,
            }
        });
        const mailoption={
            from:userids.useremail,
            to:email,
            subject:"Reset password.",
            html:`<p>hii ${name}, please click here to <a href="http://localhost:9999/forget-password?token=${token}">Reset </a> your password.</p>`
        }
        transporter.sendMail(mailoption,(error,info)=>{
            if (error) {
                console.log(error);
            } else {
                console.log("Email has been sent:-",info.response);
            }
        })
    } catch (error) {
        console.log(error.message);
        
    }
}

const forgetVerify=async(req,res)=>{
    try {
        const email=req.body.email;
        const userData=await User.findOne({email:email});
        if(userData){
                           
                const randomStrng=randomstrng.generate();
                await User.updateOne({email:email},{$set:{token:randomStrng}});
                
                sendVerificationpassword(userData.name,userData.email,randomStrng);
                res.render("forget",{message:"Please check your mail to reset your password."})
        }else{
            res.render('forget',{message:"Email is incorrect."});
        }
    } catch (error) {
        console.log(error.message);
    }
}
//------------------------

const forgetpassword=async(req,res)=>{
    try {
        const token=req.query.token;

        const tokendata=await User.findOne({token:token});
        if (tokendata) {
            res.render("forget-password",{user_id:tokendata._id});
        } else {
            res.render('404',{message:'Token is not valid.'});
        }
    } catch (error) {
        console.log(error.message);
    }
}
const resetpassword=async(req,res)=>{
    try {
        

        const password=req.body.password;


        const isPasswordStrong = isStrongPassword(password);


        if (isPasswordStrong) {
        const user_id=req.body.user_id;
        const userdata=await User.findOne({_id:user_id});
        req.session.user_id=userdata._id;
        const sequrepassword=await securePassword(password);
        

        await User.findByIdAndUpdate({_id:user_id},{$set:{password:sequrepassword}});
        
        res.redirect('index');
        }else{
            const user_id=req.body.user_id;
            
            
             
            res.render("forget-password",{message:"Password is not strong enough(Strong@123).",user_id:user_id});
        }

       
    } catch (error) {
        console.log();
        
    }
}

const verificationload=async(req,res)=>{
    try {
        res.render('verification');
    } catch (error) {
        console.log(error.message);
        
    }
}
const sendverificationlink=async(req,res)=>{
    try {
        const email=req.body.email;
        const userdata=await User.findOne({email:email});
        if(userdata){
            
            res.render('verification',{message:"Send your mail id. please check."})
        }else{
            res.render('verification',{message:'This email is not exist.'})
        }
    } catch (error) {
        console.log(error.message);
    }
}
//-----------------------home----------------------------

// const mainhome=async(req,res)=>{
//     try {
//         //res.render("index");

//     } catch (error) {
        
//     }
     
// }


const shopload = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.session.user_id });
        const categId = req.query.categid;


        let products = [];

        if (categId) {
            const categoryId = new mongoose.Types.ObjectId(categId);
            products = await Product.find({ category: categoryId }).populate('category');
           
        } else {
            products = await Product.find({}).populate('category');;
        }
        
        const Categdata = await Category.find({});
        
        
        const listedCategory = Categdata.filter((categ) => categ.is_listed === true);
        
        const listProduct = products.filter((product) => {
            const isProductListed = product.is_listed === true;

            const productCategory = listedCategory.find((category) =>
                category.name === product.category.name  && category.is_listed === true
             );

            return isProductListed && productCategory;
        });
        res.render('shop', {
            Categories: listedCategory,
            products: listProduct,
            user,
        });

    } catch (error) {
        console.log(error.message);
    }
};


const aboutload=async(req,res)=>{
    try {
        res.render("about");
    } catch (error) {
        console.log(error.message);
    }
}

const shopdetailsload=async(req,res)=>{
    try {
        res.render("shop-details");
    } catch (error) {
        console.log(error.message);
    }
}

const shoppingcartload=async(req,res)=>{
    try {
        res.render("shopping-cart");
    } catch (error) {
        console.log(error.message);
    }
}
const checkoutload=async(req,res)=>{
    try {
        res.render("checkout");
    } catch (error) {
        console.log(error.message);
        
    }
}

const blogdetailsload=async(req,res)=>{
    try {
        res.render('blog-details');
    } catch (error) {
        console.log(error.message);
    }
}

const blogload=async(req,res)=>{
    try {
        res.render("blog");
    } catch (error) {
        console.log(error.message);
    }
}

const contactload=async(req,res)=>{
    try {
        res.render("contact");
    } catch (error) {
        console.log(error.message);
        
    }
}
const homeload=async(req,res)=>{
    try {
        res.render('index');
    } catch (error) {
        
    }
}

const detailsload=async(req,res)=>{
    try {
         const productId=req.params.id
         
         const productdata=await Product.findById(productId);
        

        res.render('productdetil',{ products:productdata});
    } catch (error) {
        console.log(error.message);
    }
}

module.exports={
    registerpage,
    getregister,
    getinotp,
    otpresend,
    mailverify,
    loginload,
    verifylogin,
    loadehome,
    userlogout,
    forgetload,
    forgetVerify,
    forgetpassword,
    resetpassword,
    verificationload,
    sendverificationlink,
    verifyemailload,
    verifyemail,
    //---------------home-------------------
    //mainhome,
    shopload,
    aboutload,
    shopdetailsload,
    shoppingcartload,
    checkoutload,
    blogdetailsload,
    blogload,
    contactload,
    homeload,
    detailsload


}