const { string } = require('joi');
const mongoose=require('mongoose');


const cartSchema=new mongoose.Schema({
      user_id:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        require:true
      },
      items:[{
        product_id:{
            type:mongoose.Schema.ObjectId,
            ref:'product',
            require:true
        },
        productname:{
            type:String,
            required:true

        },
        quantity:{
            type:Number,
            default:1
        },
        price:{
            type:String,
            require:true
        },
        totel_price:{
            type:Number,
            require:true
        },
        status:{
            type:String,
            default:'placed'
        },
        cancelletionReason:{
            type:String,
            default:'none'
        }
      }]
})

const Cart=mongoose.model('Cart',cartSchema)

module.exports=Cart;