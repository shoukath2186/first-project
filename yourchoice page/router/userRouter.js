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

const userController=require('../controller/userCartController');

const profileController=require('../controller/userPfofileController');




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

user_router.get('/about',auth.islogin,controller.aboutload);

user_router.get('/shop-details',auth.islogin,controller.shopdetailsload);

user_router.get("/blog-details",auth.islogin,controller.blogdetailsload);

user_router.get("/blog",auth.islogin,controller.blogload);

user_router.get('/contact',auth.islogin,controller.contactload);

user_router.get('/showdetails/:id',controller.detailsload);

//-------------------------cart and user cart and address------------------

user_router.get('/shopping-cart',auth.islogin,userController.shoppingcartload);

user_router.post('/addcart',userController.verifyaddcart);

user_router.post('/addcart/:id',userController.cartload);

user_router.patch('/updateCart',userController.verifyQty);

user_router.post('/cartdelete',userController.verifycartdelete);

user_router.get('/checkout',auth.islogin,userController.checkoutload);

user_router.post('/sigleCheckout',userController.verifySingleCheck);

user_router.post('/addAddress',userController.addAddressverify);

user_router.post('/buyproduct',userController.verifybuyproduct);

//--------------------------------user profile-----------------------------

user_router.get('/userProfile',auth.islogin,profileController.profileLoad);

user_router.get('/editProfile',auth.islogin,profileController.editProfileLoad);

user_router.post('/editProfile',profileController.verifyeditProfile);

user_router.get('/userpassword',auth.islogin,profileController.userpasswordLoad);

user_router.post('/userpassword',profileController.verifypassword);

user_router.get('/userOrder',auth.islogin,profileController.userOrderLoda);

user_router.get('/userOererView',auth.islogin,profileController.OrderdetailLoad);

user_router.post('/userOrderRequst',profileController.verifyOrderRequst);

user_router.get('/addressManage',auth.islogin,profileController.addressManageLoad);

user_router.get('/userAddAddress',auth.islogin,profileController.userAddAddressLoad);

user_router.post('/userAddAddress',profileController.verifyuserAddAddress);

user_router.get('/EditAddAdres',auth.islogin,profileController.verifyEditAddAdres);

user_router.post('/verifyEditAddress',profileController.verifyEditAddress);

user_router.post('/deleteAddress',profileController.verifydeleteAddress);



 
module.exports=user_router
