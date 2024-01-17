const express=require('express');
const user_router=express();
const path=require('path')

user_router.set('view engine',"ejs");
user_router.set("views",'./views/userPage');

const bodyparser=require('body-parser');
user_router.use(bodyparser.json())
user_router.use(bodyparser.urlencoded({extended:true}));


const auth=require('../middleware/auth')

user_router.use(express.static(path.join(__dirname, "2homeproperties")));

const session=require('express-session');
const config=require('../config/config');
user_router.use(session({secret:config.sessionSecret,
    resave: false,
    saveUninitialized: false}));


const controller=require('../controller/userController');

user_router.get('/register',auth.islogout,controller.registerpage);

user_router.post('/register',controller.getregister);

user_router.post('/otppage',controller.verifyotp);

user_router.post('/checkOtppage',controller.checkOtppage);

user_router.post('/ResendOtppage',controller.otpresend);

user_router.get('/verify',controller.mailverify);

user_router.get('/',controller.homeload);

user_router.get('/home',controller.homeload);

user_router.get('/login',auth.islogout,controller.loginload);

user_router.get('/otppage',auth.islogout,controller.otppageload);

user_router.post('/login',controller.verifylogin);

user_router.get("/index",controller.loadehome);

user_router.get('/verifyemail',controller.verifyemailload);

user_router.post('/verifyemail',controller.verifyemail);
//---------------------------------
user_router.get('/logout',auth.islogin,controller.userlogout);

user_router.get('/forget',auth.islogout,controller.forgetload);

user_router.post('/forget',controller.forgetVerify);

user_router.get('/forget-password',auth.islogout,controller.forgetpassword);

user_router.post('/forget-password',auth.islogout,controller.resetpassword);

user_router.get('/verification',controller.verificationload);

user_router.post('/verification',controller.sendverificationlink);

//---------------------------home-------------------

user_router.get('/shop',controller.shopload);

user_router.get('/descendingShop',controller.descendingShopload);

user_router.get('/assentingShop',controller.assentingShopload)

user_router.get('/about',auth.islogin,controller.aboutload);

user_router.get('/shop-details',auth.islogin,controller.shopdetailsload);

user_router.get('/shopping-cart',auth.islogin,controller.shoppingcartload);

user_router.get('/checkout',auth.islogin,controller.checkoutload);

user_router.get("/blog-details",auth.islogin,controller.blogdetailsload);

user_router.get("/blog",auth.islogin,controller.blogload);

user_router.get('/contact',auth.islogin,controller.contactload);

user_router.get('/showdetails/:id',controller.detailsload);

 
module.exports=user_router
