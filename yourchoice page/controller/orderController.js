
const Order=require('../model/ordersModel');

const Product=require('../model/productModel');

const notificationsload=async(req,res)=>{
    try {
        const orderData=await Order.find({});
        //console.log(orderData);
        res.render('order',{order:orderData});
    } catch (error) {
        console.log(error.message);
    }
}

const productviewLoad=async(req,res)=>{
    try {
        const orderId=req.query.orderid;
        

        
        const orderdata = await Order.findOne({ _id: orderId })//.populate('items.productId');
        //console.log(orderdata)

        const productId = orderdata.items.map(item => item.productId);

        //console.log(productId);

            const productdata=await Product.find({_id:{$in: productId}});
        console.log(productdata);

        res.render('productview',{product:orderdata,productimg:productdata});
        
    } catch (error) {
        console.log(error.message);
    }
}

const verifyupdateStatus=async(req,res)=>{
    try {
        const newstatus=req.query.status;
        const orderId=req.query.dataId;
        const productid=req.query.productId;
        const userId=req.query.userId;

        

        const orderData=await Order.findOne({_id:orderId});

        //console.log(orderData);

        if(newstatus=='Cancelled'||newstatus=='Returned'||newstatus=='Approved'){
            
             const orderDatas=await Order.findOne({_id:orderId});
             
             orderDatas.items.forEach(async (item) => {
                
                 if (item.productId === productid) {
                    const productdata= await Product.findOne({_id:item.productId});
                    //console.log(productdata);
                   
                    //console.log(item);
                    const newQty=item.quantity+productdata.quantity
                    console.log(newQty);
                    await Product.updateOne({_id:productdata._id},{$set:{quantity:newQty}})


           
                }
             });

        }

        if (orderData) {
            orderData.items.forEach(async (item) => {
              if (item.productId === productid) {
                const updatedOrder = await Order.updateOne(
                  { _id: orderId, 'items.productId': productid },
                  { $set: { 'items.$.oaderStatus': newstatus } }
                );
               // console.log(updatedOrder);
              }
            });

            res.send({data:'sucsess'});
        }
          
        
    } catch (error) {
        console.log(error.message);
    }
}



module.exports={
    notificationsload,
    productviewLoad,
    verifyupdateStatus
}