const User=require('../model/userModel')



const islogin = async (req, res, next) => {
    try {

         

        if (req.session.user_id) {
            const user=await User.findOne({_id:req.session.user_id})
            
            if(user.blocked){
             res.render('login',{message:'User is blocked.'});
            }else{
                next();
            }

            
        } else {
            
            return res.render('login',{message:'Please login.'});
        }
    } catch (error) {
        console.log(error.message);
    }
};

const islogout = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            // Redirect to the home page if the user is already logged in
            res.redirect('/home');
        } else {
            // Continue to the next middleware if the user is not logged in
            next();
        }
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    islogin,
    islogout
};
