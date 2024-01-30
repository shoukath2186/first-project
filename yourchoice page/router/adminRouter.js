const express=require('express');
const admin_router=express();
const path=require('path')
admin_router.set("view engine",'ejs');
admin_router.set("views","./views/adminPage");

admin_router.use(express.json());
admin_router.use(express.urlencoded({extended:true}));

const multer=require('multer');

const flash = require('express-flash');

admin_router.use(flash())


const storage=multer.diskStorage({
    destination:function(req,file,cb){
        
        cb(null, path.join(__dirname,'..',"1adminproperties","publicImages"));
        
    },
    filename:function(req,file,cb){        
        const name = Date.now() + '-' + file.originalname
        cb(null, name);
    }
})

const upload=multer({storage:storage}).array('image',10);



const session=require('express-session');


const config=require('../config/config');
admin_router.use(session({secret:config.adminsessionSecret,
    resave: false,
    saveUninitialized: false}));

const auth=require("../middleware/adminauth")



const categoryController=require('../controller/categoryController')

const adminController=require('../controller/adminController');

const productController=require('../controller/productController')

const orderController=require('../controller/orderController');




admin_router.get("/admin/login",auth.islogout,adminController.adminloginload);

admin_router.get("/admin",auth.islogout,adminController.adminloginload);

admin_router.post('/admin/getadmin',adminController.getdata);

admin_router.get("/admin/index",adminController.testload);

admin_router.get('/admin/docs',auth.islogin,adminController.docsload);

admin_router.get('/admin/account',auth.islogin,adminController.accountload);

admin_router.get('/admin/settings',auth.islogin,adminController.settingsload);

admin_router.get('/admin/charts',auth.islogin,adminController.chartsload);

admin_router.get('/admin/help',auth.islogin,adminController.helpload);

admin_router.post('/admin/users/:action/:id',adminController.updateuserstatus);

admin_router.get("/admin/logout",auth.islogin,adminController.logoutload);

//-----------------------category-------------------

admin_router.get('/admin/category',auth.islogin,categoryController.ordersload);

admin_router.get("/admin/addcategory",auth.islogin,categoryController.addcategoryload);

admin_router.post('/admin/addcategory',categoryController.verifyaddcategory);

admin_router.post('/admin/orders/:action/:id',categoryController.verifyeditcategory);

admin_router.get('/admin/editcategory',auth.islogin,categoryController.editcategoryload);

admin_router.post('/admin/editcategory',categoryController.geteditcategory);

admin_router.get('/admin/deletecatege/:id',auth.islogin,categoryController.deletecateg);

//--------------product-------------

admin_router.get('/admin/addproduct',auth.islogin,productController.addproductload);

admin_router.get('/admin/addingproduct',auth.islogin,productController.addingproductload);

admin_router.post('/admin/addingproduct',upload,productController.verifyaddingproduct);

admin_router.post('/admin/product/:action/:id',productController.productStatus);

admin_router.get('/admin/editProduct',auth.islogin,productController.editingProduct);

admin_router.post("/admin/editProduct",upload,productController.verifyEditProduct);

admin_router.get('/admin/deleteproduct/:productId',productController.deleteproduct);

//--------------------------order----------------------------------

admin_router.get("/admin/notifications",auth.islogin,orderController.notificationsload);

admin_router.get('/admin/productview',auth.islogin,orderController.productviewLoad);

admin_router.post('/admin/updateStatus',orderController.verifyupdateStatus);








module.exports=admin_router;