const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    address:[{
        name:{
            type:String
            
        },
        phone:{
            type:String
        },
        country:{
            type:String
        },
        landmark:{
            type:String
        },
        city:{
            type:String
        },
        address:{
            type:String
        },
        pincode:{
            type:String
        }

    }],
    is_admin:{
        type:Number,
        required:true
    },
    is_varified:{
        type:Number,
        default:0

    },
    blocked:{
        type:Boolean,
        require:true
    },
    token:{
        type:String,
        default:''
    },
    is_otp:{
        type:Boolean,
        required:true
    },
    otp_verify:{
        type:Boolean,
        default:false
    }
    
},{
    timestamps: false // Automatically add createdAt and updatedAt fields
});

userSchema.index({ is_otp: 1 }, { expireAfterSeconds: 90 });


const User=mongoose.model("User",userSchema)

module.exports=User;