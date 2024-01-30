
const User = require('../model/userModel');

const Order=require('../model/ordersModel'); 

const Product=require('../model/productModel');

const bcrypt=require("bcrypt");
const product = require('../model/productModel');

const profileLoad=async(req,res)=>{
    try {
        const userid=req.session.user_id;
        const userData=await User.findOne({_id:userid})
        res.render('profile',{data:userData});
        
    } catch (error) {
        console.log(error.message);
    }
}


const editProfileLoad=async(req,res)=>{
    try {
        const userid=req.session.user_id;
        const userData=await User.findOne({_id:userid})

        res.render('editProfile',{data:userData})
    } catch (error) {
        console.log(error.message);
    }
}

const verifyeditProfile=async(req,res)=>{
    try {
        const name=req.body.name;
        const userid=req.session.user_id;
        const mobile=req.body.mobile;

        await User.updateOne({_id:userid},{$set:{name:name,mobile:mobile}});

        res.redirect('/userProfile');
        
    } catch (error) {
        console.log(error.message);
    }
}

const userpasswordLoad=async(req,res)=>{
    try {
        res.render('userPassword')
    } catch (error) {
        console.log(error.message);
    }
}
//------------------------------------------------------------------------------------------
function isStrongPassword(password) {
    // Minimum length requirement
    if (password.length < 8) {
        return false;
    }

    // Check for uppercase and lowercase letters
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
        return false;
    }

    // Check for at least one numeric digit
    if (!/\d/.test(password)) {
        return false;
    }

    // Check for at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return false;
    }

    // All criteria passed
    return true;
}


const securePassword=async(password1)=>{
    try {
        const passwordHash=await bcrypt.hash(password1,10);
          return passwordHash
        
    } catch (error) {
        console.log(error.message);
    }
}

//------------------------------------------------------------------------------------------

const verifypassword=async(req,res)=>{
    try {
        const userId=req.session.user_id;
        const oldPassword=req.body.passwordold
        const new1password=req.body.passwordnew1;
        const new2password=req.body.passwordnew2;

        //console.log(0,oldPassword,111,new1password,222,new2password);

        const userData=await User.findOne({_id:userId}) 

        const passwordmatch=await bcrypt.compare(oldPassword,userData.password)

        if(passwordmatch){

        if(new1password===new2password){
          const checkpasswodr=isStrongPassword(new1password);

          if(checkpasswodr){
            const password=await securePassword(new1password);
              await User.updateOne({_id:userId},{$set:{password:password}});

              res.render('userPassword',{newmessage:'Password changed successfully.'});
          }else{
               
            res.render('userPassword',{oldpassword:oldPassword,pass2:new2password,new1PassEror:"Password is not strong enough(Strong@123)."});  
          }
        }else{
            //console.log('pass not sime');
        }

    }else{
        if(oldPassword ){
        res.render('userPassword',{pass1:new1password,pass2:new2password,oldPassEror:'Password not valid.'});
        }   
    }
        
    } catch (error) {
        console.log(error.message);
    }
}

//--------------------------------------------------------------------------

const userOrderLoda = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const orderData = await Order.find({ userId: userId });

        // Assuming each order has an 'items' array
        const productIds = orderData.flatMap(order => order.items.map(item => item.productId));

        // Check if productIds array is not empty before querying the database
        let productData;
        if (productIds.length > 0) {
             productData = await Product.find({ _id: { $in: productIds } });
            //console.log(22222, productData);
        } else {
            console.log("No productIds found");
        }

       // console.log(11111, orderData);

        res.render('userOrder', { data: orderData ,productimg:productData });
    } catch (error) {
        console.log(error.message);
    }
};


const OrderdetailLoad=async(req,res)=>{
    try {

        const orderid=req.query.orderid;
       
        const orderData=await Order.findOne({_id:orderid});

       res.render('userSinglOrder',{order:orderData});
        
    } catch (error) {
        console.log(error.message);
    }
}


const verifyOrderRequst=async(req,res)=>{
    try {

        const userId = req.session.user_id;
        const orderId=req.query.orderid;
        const productId=req.query.productid;
        const action=req.query.data;
        const reason=req.query.reason;

       
        
        if(action=='cancel'){
            const orderData = await Order.findOne({ _id: orderId, userId: userId, 'items.productId': productId });

            if (orderData) {
                const updatedOrder = await Order.updateOne(
                    { _id: orderId, 'items.productId': productId },
                    { $set: { 'items.$.oaderStatus': 'Requested cancellation', 'items.$.cancellationreason': reason } }
                );
            
                //console.log(updatedOrder);
                res.send({data:'success'});
                // Check if the update was successful
                if (updatedOrder.nModified > 0) {
                    console.log('Order updated successfully.');
                } else {
                   // console.log('No orders were updated. Check your criteria.');
                }
            } else {
                console.log('No order found with the provided orderId, userId, and productId.');
            }
            
        }else{
            const orderData = await Order.findOne({ _id: orderId, userId: userId, 'items.productId': productId });

            if (orderData) {
                const updatedOrder = await Order.updateOne(
                    { _id: orderId, 'items.productId': productId },
                    { $set: { 'items.$.oaderStatus': 'Requested return', 'items.$.cancellationreason': reason } }
                );
            
                //console.log(11111111111,updatedOrder);
                 res.send({data:'success'});
                // Check if the update was successful
                if (updatedOrder.nModified > 0) {
                    console.log('Order updated successfully.');
                } else {
                   // console.log('No orders were updated. Check your criteria.');
                }
                //res.sent({data:'success'});
            } else {
                console.log('No order found with the provided orderId, userId, and productId.');
            }

        }
        
    } catch (error) {
        console.log(error.message);
    }
}



const addressManageLoad=async(req,res)=>{
    try {
        const userId = req.session.user_id;

        const userdata=await User.findOne({_id:userId});

        res.render('userAddress',{datas:userdata});
        
    } catch (error) {
        console.log(error.message);
    }
}


const userAddAddressLoad=async(req,res)=>{
    try {

        res.render('userAddAddress');
        
    } catch (error) {
        console.log(error.message);
    }
}


const verifyuserAddAddress=async(req,res)=>{
    try {

        const userid = req.session.user_id;

        const { name, phone, country, landmark, city, address, pincode } = req.body;

        const userdata = await User.findOneAndUpdate({ _id: userid }, {

            $push: {
                address: {
                    name: name,
                    phone: phone,
                    country: country,
                    landmark: landmark,
                    city: city,
                    address: address,
                    pincode: pincode
                }
            }

        },
            { new: true }
        );

       res.redirect('/addressManage')
    } catch (error) {
        console.log(error.message);
    }
}


const verifyEditAddAdres=async(req,res)=>{
    try {

        const userid=req.query.userids;
        const addressid=req.query.addressids;

        //console.log(req.query);

        //console.log(11111,userid,22222,addressid);

        const user=await User.findOne({_id:userid,'address._id':addressid});

        let Address;
        if (user && user.address) {
            // Find the matching address in the user's address array
             Address = user.address.find(addr => addr._id.toString() === addressid);
        }    

        //console.log(11111111111,Address);

        res.render('userEditAddress',{address:Address});
        
    } catch (error) {
        console.log(error.message);
    }
}


const verifyEditAddress=async(req,res)=>{
    try {

        const userid = req.session.user_id;
        const addressId=req.body.addressId;

        const { name, phone, country, landmark, city, address, pincode } = req.body;

        const updateData= await User.updateOne({_id:userid,'address._id':addressId},{
            $set:{ 
            'address.$.name': name,
            'address.$.phone': phone,
            'address.$.country': country,
            'address.$.landmark': landmark,
            'address.$.city': city,
            'address.$.address': address,
            'address.$.pincode': pincode
            }
        })

        //console.log(updateData);

        res.redirect('/addressManage')
        
    } catch (error) {
        console.log(error.message);
    }
}


const verifydeleteAddress=async(req,res)=>{
    try {

        const userid=req.body.userid;
        const addressid=req.body.addressid;

        //console.log(req.body);
        

        const updateData = await User.updateOne(
            { _id: userid },
            {
                $pull: {
                    address: { _id: addressid }
                }
            }
        );
        res.redirect('/addressManage')
        //console.log(updateData);
        
        
    } catch (error) {
        console.log(error.message);
    }
}




module.exports={
    profileLoad,
    editProfileLoad,
    verifyeditProfile,
    userpasswordLoad,
    verifypassword,
    userOrderLoda,
    OrderdetailLoad,
    verifyOrderRequst,
    addressManageLoad,
    userAddAddressLoad,
    verifyuserAddAddress,
    verifyEditAddAdres,
    verifyEditAddress,
    verifydeleteAddress,


}
