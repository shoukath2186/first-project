


const mongoose=require("mongoose")
const userSchema=mongoose.Schema;

const userOTPverificationSchema=new userSchema({
    email:String,
    otp:String,
    createdAt:Date,
    expiresAt:Date
});

const userOTPverification=mongoose.model('UserOtpModel',userOTPverificationSchema)


module.exports=userOTPverification