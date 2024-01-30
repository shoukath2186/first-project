const { string } = require('joi');
const mongoose=require('mongoose');


const orderSchema=new  mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    orderId:{
        type:String
    },
    deliveryaddress:{
        type:Object,
        required:true
    },
    username:{
        type:String,
        required:true
            
    },
    totalamount:{
        type:String,
        required:true
    },
    totaldiscountamount:{
        type:Number,
        default:0
    },
    date:{
        type:Date,
        required:true
    },
    expecteddelivery:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    paymentId:{
        type:String
    },
    totel:{
        type:Number
    },
    items:[{
        productId:{
            type:String,
            ref:'products',
            required:true
        },
        productname:{
            type:String,
            required:true
        },
        quantity:{
            type:Number,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        totalprice:{
            type:Number,
            required:true
        },
        discountperitem:{
            type:String,
            default:0
        },
        oaderStatus:{
            type:String,
            default:'placed'
        },
        cancellationreason:{
            type:String
        }
    }]

})


const order=mongoose.model('order',orderSchema)


module.exports=order

