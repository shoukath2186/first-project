


const islogin = async (req, res, next) => {
    try {
        

        if (req.session.admin_id) {
            next();
        } else {
            return res.render('login',{message:'Please login.'});
            //next();
        }
    } catch (error) {
        console.log(error.message);
    }
};

const islogout = async (req, res, next) => {
    try {
        
        if (req.session.admin_id) {
            res.redirect('/admin/index');
        } else {
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
