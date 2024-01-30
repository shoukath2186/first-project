


const Category=require('../model/categoryMode');

const User=require('../model/userModel');

const config=require('../config/config');








const adminloginload=async(req,res)=>{
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }
}

const getdata=async(req,res)=>{
    try {
        const email=req.body.email;
        const password=req.body.password;
        const adminemail=config.adminemail;
        const adminpassword=config.adminpassword;
        if (email==adminemail) {
            if (password==adminpassword) {

                
                req.session.admin_id=email;


                res.render("index");
                
            } else {
                res.render('login',{message:"Password not match."});
            }
            
        } else {
            res.render('login',{message:"Email incorrect."})
        } 
        
    } catch (error) {
        console.log(error.message);
    }

}

const testload=async(req,res)=>{
    try {
        res.render('index');
    } catch (error) {
        console.log(error.message);
    }
}

const docsload=async(req,res)=>{
    try {
        const users=await User.find({is_admin:0});
        res.render('docs',{users:users});
    } catch (error) {
        console.log(error.message);
        
    }
}



const accountload=async(req,res)=>{
    try {
        res.render('account');
    } catch (error) {
        console.log(error.message);
    }
}

const settingsload=async(req,res)=>{
    try {
        res.render('settings');
    } catch (error) {
        console.log(error.message);
    }
}

const chartsload=async(req,res)=>{
    try {
        res.render('charts');
    } catch (error) {
        console.log(error.message);
    }
}

const helpload=async(req,res)=>{
    try {
        res.render('help');
    } catch (error) {
        console.log(error.message);
    }
}





const updateuserstatus=async(req,res)=>{
    try {
        const userid=req.params.id;
        const userdata=await User.findById(userid);
        
        if(!userdata){
            return res.status(404).send('User not found.');
        }
        let updateUser;
       if(userdata.blocked){
           updateUser=await User.findByIdAndUpdate(userid, {$set:{blocked:false}},{ new: true });
       } else{
           updateUser=await User.findByIdAndUpdate(userid, {$set:{blocked:true}},{ new: true });
       }

       res.send({status: 'success', user: updateUser});


    } catch (error) {
        console.log(error.message);
        
    }
}


const logoutload=async(req,res)=>{
    try {
        req.session.destroy();
        
        res.redirect('/admin/login')
    } catch (error) {
        console.log(error.message);
    }
}

//----------------orders---------------------------------------
 
module.exports={
    adminloginload,
    getdata,
    testload,
    docsload,
    accountload,
    settingsload,
    chartsload,
    helpload,
    updateuserstatus,
    logoutload
};