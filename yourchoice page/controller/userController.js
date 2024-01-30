const User=require('../model/userModel');

const UserOtp=require('../model/userOtpModel');

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


const sendotp=async(email)=>{
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

       const otp = `${Math.floor(1000+Math.random()*9000)}`;
       
       const hashotp=await securePassword(otp);

       
        const otpData=new UserOtp({
            email:email,
            otp:hashotp,


        })
        
        await otpData.save();

        
        
        setTimeout(async() => {
            await UserOtp.deleteOne({email:email});
        }, 60000);


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



//------------otp timer----------------

//------------------

const registerpage=async(req,res)=>{
    try {
        res.render("register")
    } catch (error) {
        console.log(error.message);
    }
}




const Joi = require('joi');
const e = require('express');

// Define schema for email
const emailSchema = Joi.string().email().required();

// Define schema for name
const nameSchema = Joi.string().min(3).max(30).required();




const getregister=async(req,res)=>{
    try {

        const checkUser =await User.findOne({email:req.body.email})
        if (checkUser) {
         return res.render("register",{message:'User already exist.'})
        }
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
    
        await user.save()
        
        
        
        
        await sendotp(req.body.email);
        
        
        res.redirect(`/otppage?email=${req.body.email}`);
        
       
          
          
       }else{

        res.render("register",{messagepass:"Password not match.",email:req.body.email,name:req.body.name,
        phone:req.body.Phone,password1:req.body.password1,password2:req.body.password2 });
        
        }
    } catch (error) {
        console.log(error.message);
        
    }
}
//----------------otp controller------------


const otppageload=async(req,res)=>{
    try {
        res.render('otpPage',{message:'Send your otp.'})
    } catch (error) {
        console.log(error.message);
    }
}




const otpresend=async(req,res)=>{
    try {

        
        const email=req.query.email
        //console.log(email); 

        await sendotp(email);
        
        
       
    } catch (error) {
        console.log(error.message);
    }

}
//-------------------------------------

const checkOtppage=async(req,res)=>{
    try {
        
        const email=req.query.email;
        const otp=req.query.otp;
        

       const userdata= await UserOtp.findOne({email:email});
       if(userdata){
        
        const hashotp= await bcrypt.compare(otp,userdata.otp)

       if (hashotp) {
        res.send({status : 'success',updated:true});
       } else {
        res.send({status : 'fail',updated:true});
       } 
    }else{
        res.send({status:'fail',updated:true});
    }
        
    } catch (error) {
        console.log(error.message);
    }
}



const verifyotp=async(req,res)=>{
    try {
        
        const email=req.query.email;
        const otp=req.body.otp;
        
        if(!email){
            return res.render("register",{messagepass:"Please Register."})
        }
        const userdata=await UserOtp.findOne({email:email})
        
        if(userdata){
            
            const hashotp=await bcrypt.compare(otp,userdata.otp)

             if (hashotp) {
                
                await User.updateOne({email:email},{$set:{otp_verify:true}})
                
                res.render('login',{message:'Otp verified Successfully.'})
             } else {
                 res.render('otpPage',{message:"Otp doesn't match."})
             }
        }else{
            res.render("register",{messagepass:"User not valid."})
        }

        
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

               res.render('login',{message:"Email not verified."})
            }else{
                 req.session.user_id=userdata._id;

                 res.render('index',{user_id:userdata});
            }
        }else{
            res.render('login',{message:'User is blocked.'});
        }
        }else{
            res.render('login',{passmessage:'password not matched.',email:email})
        }

            
        } else {
            if(email){
            res.render('login',{emailmessage:"Email is incorrect.",pass:password});
            }
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

        if(userData.otp_verify === false){
            return res.render('forget',{message:"Email not verified."});
        }


        if(userData){
                           
                const randomStrng=randomstrng.generate();
                await User.updateOne({email:email},{$set:{token:randomStrng}});
                
                sendVerificationpassword(userData.name,userData.email,randomStrng);
                res.render("login",{message:"Please check your mail to reset your password."});
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
        

        await User.findByIdAndUpdate({_id:user_id},{$set:{password:sequrepassword,is_otp:true}});
        
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



const shopload = async (req, res) => {
         const Item_page=9;
    try {
        const user = await User.findOne({ _id: req.session.user_id });
        const categId = req.query.categid? req.query.categid:''
        const search=req.query.search||''
        const page=parseInt(req.query.page)||1;
        const skip=(page-1)*Item_page;
        
        console.log(search);
        
        

        const query={
            is_listed:true,
            $or:[{ name:{$regex:search,$options: "i"}}],
        };

         

        

        if (categId) {
            query.category = new mongoose.Types.ObjectId(categId);
            //products = await Product.find({ category: categoryId }).populate('category');
           
        } 
        //console.log("skip:-",skip,'limit-',Item_page);
        const products=await Product.find(query)
         .skip(skip)
         .limit(Item_page)
         .populate('category');

        

        const totalProductsCount=await Product.countDocuments(query);
        const totalPages=Math.ceil(totalProductsCount/Item_page);

        
    
        
        const Categdata = await Category.find({});

        
        
        const listedCategory = Categdata.filter((categ) => categ.is_listed === true);
        
      
        const listdProduct = products.filter((product) => 
         product.quantity > 0 && product.category && listedCategory.some((category) =>
        category.name === product.category.name && category.is_listed 
       )
    );

    const sort=Number(req.query.sort);

    //console.log(sort);

    if (sort === 1) {
        listdProduct.sort((a, b) => a.price - b.price);
    } else if (sort === -1) {
        listdProduct.sort((a, b) => b.price - a.price);
    }

        //console.log(totalPages);

        res.render('shop', {
            Categories: listedCategory,
            products: listdProduct,
            user,
            search,
            currentPage:page,
            totalPages,
            sort,
            categId
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
    otppageload,
    checkOtppage,
    verifyotp,
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
    blogdetailsload,
    blogload,
    contactload,
    homeload,
    detailsload


}