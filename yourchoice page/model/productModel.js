
const mongoose=require("mongoose");


const ProductScema=new mongoose.Schema({
    image:{
        type:[],
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    quantity:{
        type:Number,
        default:0,
    },
    discription:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'category',
        required: true
    },
    brand:{
        type:String,
        required:true
    },
    date: {
        type: Date,
        default: new Date(),
    },
    is_listed:{
        type:Boolean,
        default:true
    }
});

const product=mongoose.model('product',ProductScema);
module.exports=product;