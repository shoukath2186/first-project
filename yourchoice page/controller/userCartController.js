
const Product = require("../model/productModel");

const Cart = require('../model/cartModel');

const User = require('../model/userModel');

const Order = require('../model/ordersModel');

const randomstrng = require('randomstring');


//---------------------random string-------------------------------------

//const randomStrng=randomstrng.generate();



//---------------------------------------------------


const shoppingcartload = async (req, res) => {
    try {
        const user = req.session.user_id;

        const cartDetails = await Cart.find({ user_id: user }).populate('items.product_id').populate('user_id');



        if (cartDetails && cartDetails.length > 0) {
            // Initialize total price
            let total = 0;

            // Loop through each cart
            cartDetails.forEach(cart => {
                // Loop through each item in the cart
                cart.items.forEach(item => {
                    // Assuming 'totel_price' is a numeric field, add it to the total
                    total += item.totel_price;
                });
            });



            res.render("cart", { cartdata: cartDetails, totelprice: total });
        } else {
            res.render('cart', { cartdata: cartDetails, totelprice: 0 })
        }
    } catch (error) {
        console.log(error.message);
    }
}
//--------------------------

const verifyaddcart = async (req, res) => {
    try {
        const userid = req.session.user_id;
        const newQuantity = req.body.qty;
        const productId = req.body.productid.toString();

        //console.log(1111,newQuantity);



        const cartData = await Cart.find({ user_id: userid, 'items.product_id': productId }).populate('items.product_id');


        //console.log(cartData);

        if (cartData.length > 0) {



            const itemsArray = cartData[0].items;


            let totalQty = 0;
            const newQty = parseInt(newQuantity);

            itemsArray.forEach(item => {
                // Assuming item.product_id is the populated object
                totalQty += item.product_id.quantity;
            });

            

            // Calculate the total quantity
            let cartQty = 0;
            itemsArray.forEach(item => {
                // Assuming each item has a 'quantity' property
                cartQty += item.quantity;
            });

            const sumQty = cartQty + newQty;

           // console.log(1111, cartQty, 22222, sumQty);

            let finalQty;

            if (sumQty > totalQty) {
                 
                finalQty=totalQty.toString();
            } else {
                 finalQty=sumQty.toString();
            }





            const cartdata = await Cart.updateOne(
                { user_id: userid, 'items.product_id': productId },
                { $set: { 'items.$.quantity': finalQty } }
            );
            //console.log(cartdata);
            res.redirect(`/showdetails/${productId}`);
        } else {

            const userdata=await User.findById({_id:userid});

            const productdata=await Product.findOne({_id:productId})

            
            const newCart = new Cart({
                user_id: userdata,
                items: [{
                    product_id:productdata,
                    productname:productdata.name,
                    quantity:newQuantity,
                    price:productdata.price,
                    totel_price:productdata.price,
                }]
            })

            await newCart.save()

            await Cart.updateOne(
                { user_id: userid, 'items.product_id': productId },
                { $set: { 'items.$.quantity': newQuantity } }
            );

            
           res.redirect(`/showdetails/${productId}`);
        }



    } catch (error) {
        console.log(error.message);
    }
}


const cartload = async (req, res) => {
    try {
        const productid = req.params.id;

        const userid = req.session.user_id;


        if (userid == undefined) {
            return res.render('newlogin', { message: 'Please login.' });

        }

        const userdata = await User.findOne({ _id: userid });



        const productdetil = await Product.findOne({ _id: productid });


        const cartdata = await Cart.find({ user_id: userid, 'items.product_id': productid })

        if (cartdata && cartdata.length > 0) {


            const cartData = await Cart.findOne({ user_id: userid, 'items.product_id': productid }).populate('items.product_id');






            if (cartData.items[0].quantity === cartData.items[0].product_id.quantity) {

                return res.redirect('/shop');


            }



            if (cartData) {
                //console.log(7365789031,cartData);
                const itemIndex = cartData.items.findIndex(item => item.product_id.equals(productid));

                if (itemIndex !== -1) {
                    // Increment quantity by 1
                    cartData.items[itemIndex].quantity += 1;

                    // Update total price based on the updated quantity
                    cartData.items[itemIndex].totel_price = parseFloat(cartData.items[itemIndex].price) * cartData.items[itemIndex].quantity;

                    // Save the updated document back to the database
                    const updatedCart = await cartData.save();
                    console.log(updatedCart);
                } else {
                    console.log('Item not found in the cart');
                }
            } else {
                console.log('Cart not found');
            }

            //console.log(a);        


            res.redirect('/shop');
        } else {



            const newCart = new Cart({
                user_id: userdata,
                items: [{
                    product_id: productdetil,
                    productname: productdetil.name,
                    price: productdetil.price,
                    totel_price: productdetil.price,
                }]
            })

            await newCart.save()

            res.redirect('/shop')

        }
    } catch (error) {
        console.log(error.message);
    }
}





const verifyQty = async (req, res) => {
    try {
        const user = req.session.user_id;
        const qty = req.query.qty;
        const cartid = req.query.cartid;
        const productid = req.query.productid;


        //console.log(req.query);

        const cartdata = await Cart.findOne(
            { _id: cartid, user_id: user, 'items.product_id': productid }
        );
        //console.log(cartdata);


        if (cartdata) {
            const itemIndex = cartdata.items.findIndex(item => item.product_id.equals(productid));

            if (itemIndex !== -1) {
                const item = cartdata.items[itemIndex];
                item.quantity = parseInt(qty);
                item.totel_price = item.price * parseInt(qty);
                const update = await cartdata.save();
                //console.log(update);
            } else {
                console.log('Item not found in the cart');
            }
        } else {
            console.log('Cart not found');
        }


        if (cartdata) {

            res.send({ status: 'success', updated: true });
        } else {
            res.send({ status: 'faile', updated: false });
        }





    } catch (error) {
        console.log(error.message);
    }
}

const verifycartdelete = async (req, res) => {
    try {
        const user = req.session.user_id;
        const cartid = req.query.cartid;
        console.log(cartid);
        await Cart.deleteOne({ _id: cartid, user_id: user });

        res.redirect('/shopping-cart')

    } catch (error) {
        console.log(error.message);
    }
}


//----------------------------------------------------------------------------------------------------------------------

const checkoutload = async (req, res) => {
    try {
        const userid = req.session.user_id;

        const userdata = await User.findOne({ _id: userid });

        const cartdata = await Cart.find({ user_id: userid })

        let total = 0;

        // Loop through each cart
        cartdata.forEach(cart => {
            // Loop through each item in the cart
            cart.items.forEach(item => {
                // Assuming 'totel_price' is a numeric field, add it to the total
                total += item.totel_price;
            });
        });
        //console.log(cartdata);
        //console.log(834894503);
        res.render('checkout', { userdata: userdata, cart: cartdata, total: total });

    } catch (error) {
        console.log(error.message);

    }
}




const verifySingleCheck = async (req, res) => {
    try {


        const userid = req.session.user_id;

        const fullproduct = req.query.fullproduct;





        const userdata = await User.findOne({ _id: userid });
        if (fullproduct) {
            res.redirect('/checkout')
        } else {
            const cartid = req.query.cartid;


            const cartdata = await Cart.findById({ _id: cartid, user_id: userid }).populate('items.product_id');

            //console.log(cartdata);

            const total = cartdata.items[0].totel_price;

            //console.log('cart data;',cartdata,'user data;',userdata,'totel;',total);
            res.render('checkout', { userdata: userdata, cart: cartdata, total: total });
        }
    } catch (error) {
        console.log(error.message);
    }
}







const addAddressverify = async (req, res) => {
    try {

        const userid = req.session.user_id;

        const { name, phone, country, landmark, city, address, pincode } = req.body;

        //console.log(req.body);

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

        const cartid = req.query.cartid;



        if (cartid) {
            //console.log(cartid);
            const cartdata = await Cart.findById({ _id: cartid, user_id: userid });

            const userdata = await User.findOne({ _id: userid });

            //console.log(cartdata);

            const total = cartdata.items[0].totel_price;

            //console.log('cart data;',cartdata,'user data;',userdata,'totel;',total);
            res.render('checkout', { userdata: userdata, cart: cartdata, total: total });
        } else {
            res.redirect('/checkout');
        }


    } catch (error) {
        console.log(error.message);
    }
}

//-------------------------------------------------------------------------------------------------------------------------

const verifybuyproduct = async (req, res) => {
    try {
        const userid = req.session.user_id;
        const addressid = req.body.selectedAddressId;
        const CartdropaId= req.body.cartIds

        
        

        const cartid = req.query.cartid;
        let total = 0;

        //console.log(cartid);

        let items = []; // Initialize as an empty array

        if (cartid) {
            const cartData = await Cart.findOne({ _id: cartid, user_id: userid });

            //console.log(cartdata.items);



            cartData.items.forEach((item) => {
                total += item.totel_price;
                const newItem = {
                    productId: item.product_id, // Adjust the property name if needed
                    productname: item.productname,
                    quantity: item.quantity,
                    price: item.price,
                    totalprice: item.totel_price,
                    cancellationreason: '' // Adjust the default value as needed
                }
                items.push(newItem);
            }

            );

            await Cart.deleteOne({_id:cartid})
            //console.log('cartData:',cartdata,'totel:',total);
        } else {

            const cartData = await Cart.find({ user_id: userid });

            cartData.forEach((cart) => {
                cart.items.forEach((item) => {
                    // Assuming 'totel_price' is a numeric field, add it to the total
                    total += item.totel_price;

                    // Create items array
                    const newItem = {
                        productId: item.product_id, // Adjust the property name if needed
                        productname: item.productname,
                        quantity: item.quantity,
                        price: item.price,
                        totalprice: item.totel_price,
                        cancellationreason: ''
                    };

                    // Push the new item into the items array
                    items.push(newItem);
                });
            });

        await Cart.deleteMany({user_id: userid});

        }

        const date = new Date();
        const delivery = new Date(date.getTime() + 10 * 24 * 60 * 60 * 1000);
        const deliveryDate = delivery.toLocaleString("en-US", { year: "numeric", month: "short", day: "2-digit" }).replace(/\//g, "-");

        const userdata = await User.findOne({ _id: userid });

        const randomString = randomstrng.generate({
            length: 15,
            charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        });
        const paymentid = randomstrng.generate({
            length: 10,
            charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        });

        const matchingAddress = userdata.address.find(addr => addr._id == addressid);



        const newOrder = new Order({
            userId: userdata,
            orderId: randomString,
            deliveryaddress: matchingAddress,  // Replace with the actual address or addressid,
            username: userdata.name,
            totalamount: total,
            date: new Date(),
            expecteddelivery: deliveryDate,
            status: 'placed',
            paymentId: paymentid,
            totel: total,
            items: items
        });



        const orderdatas = await newOrder.save();

        

        const updatePromises = orderdatas.items.map(async (item) => {
            const product = await Product.findById(item.productId);
            if (product) {
              const newQuantity = product.quantity - item.quantity;
              await Product.updateOne(
                { _id: item.productId },
                { $set: { quantity: newQuantity } }
              );
            }
          });
          
          await Promise.all(updatePromises);
          

        
        res.render('ordersuccesspage', { order: orderdatas });


    } catch (error) {
        console.log(error.message);
    }
}



module.exports = {
    shoppingcartload,
    verifyaddcart,
    cartload,
    verifyQty,
    verifycartdelete,
    checkoutload,
    verifySingleCheck,
    addAddressverify,
    verifybuyproduct
}