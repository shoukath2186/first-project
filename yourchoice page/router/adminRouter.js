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

const adminContrroller=require('../controller/adminController');

const productController=require('../controller/productController')




admin_router.get("/admin/login",auth.islogout,adminContrroller.adminloginload);

admin_router.get("/admin",auth.islogout,adminContrroller.adminloginload);

admin_router.post('/admin/getadmin',adminContrroller.getdata);

admin_router.get("/admin/index",adminContrroller.testload);

admin_router.get('/admin/docs',auth.islogin,adminContrroller.docsload);

admin_router.get('/admin/orders',auth.islogin,adminContrroller.ordersload);

admin_router.get("/admin/notifications",auth.islogin,adminContrroller.notificationsload);

admin_router.get('/admin/account',auth.islogin,adminContrroller.accountload);

admin_router.get('/admin/settings',auth.islogin,adminContrroller.settingsload);

admin_router.get('/admin/charts',auth.islogin,adminContrroller.chartsload);

admin_router.get('/admin/help',auth.islogin,adminContrroller.helpload);

admin_router.get("/admin/addcategory",auth.islogin,adminContrroller.addcategoryload);

admin_router.post('/admin/users/:action/:id',adminContrroller.updateuserstatus);

admin_router.get("/admin/logout",auth.islogin,adminContrroller.logoutload);

//-----------------------category-------------------

admin_router.post('/admin/addcategory',categoryController.getaddcategory);

admin_router.post('/admin/orders/:action/:id',categoryController.getcategory);

admin_router.get('/admin/editcategory',auth.islogin,categoryController.editcategoryload);

admin_router.post('/admin/editcategory',categoryController.geteditcategory);

admin_router.get('/admin/deletecatege/:id',auth.islogin,categoryController.deletecateg);

//--------------product-------------

admin_router.get('/admin/addproduct',auth.islogin,productController.addproductload);

admin_router.get('/admin/addingproduct',auth.islogin,productController.addingproductload);

admin_router.post('/admin/addingproduct',upload,productController.getaddingproduct);

admin_router.post('/admin/product/:action/:id',productController.productStatus);

admin_router.get('/admin/editProduct',auth.islogin,productController.editingProduct);

admin_router.post("/admin/editProduct",upload,productController.geteditProduct);

admin_router.get('/admin/deleteproduct/:productId',productController.deleteproduct);








module.exports=admin_router;