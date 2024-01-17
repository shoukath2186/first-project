

const Category=require('../model/categoryMode');

const User=require('../model/userModel');

const config=require('../config/config');
const product = require('../model/productModel');


const getaddcategory=async(req,res)=>{
    try {
        const existCategory=await Category.findOne({name:req.body.categoryName});
        if(existCategory){
          req.flash('message', "Category already exist");
          res.redirect('/admin/addcategory')
        }else{
          const {categoryName, description}= req.body
          //new ctege
          const newCateg=new Category({
            name:categoryName.toUpperCase(),
            description,
          })
          await newCateg.save();
          res.redirect('/admin/orders');

        }
    } catch (error) {
        console.log(error.message);
    }
}

const getcategory=async(req,res)=>{
    try {
        const categoryId=req.params.id
        const categData=await Category.findById(categoryId);
        if(!categData){
            return res.status(404).send('category not found');

        }
        let updatedCategory;
        if(categData.is_listed){
           updatedCategory=await Category.findByIdAndUpdate(categoryId,{$set:{is_listed:false}},{new:true})
        }else{
           updatedCategory=await Category.findByIdAndUpdate(categoryId,{$set:{is_listed:true}},{new:true})
        }
        res.send({status:'success',categories:updatedCategory});
        
    } catch (error) {
        console.log(error.message);
    }
}


const editcategoryload=async(req,res)=>{

    try {
        const categoryid=req.query.categid;
    const data=await Category.findOne({_id:categoryid});
    if(!data){
        req.flash('message','Category not found.')
        return res.redirect("/admin/editcategory")
    }
    res.render('editcategory',{ categories: data });
        
    } catch (error) {
        
    }
    
}



const geteditcategory=async(req,res)=>{
    try {
        const existingCategory=await Category.findOne({ name: req.body.categoryName});
        
        if(existingCategory&& existingCategory._id.toString() !==req.body.id ){
            req.flash('message','Ctegory alredy exists.');
            return res.redirect('/admin/editcategory?categid='+req.body.id);

        }
        await Category.findByIdAndUpdate({_id: req.body.id},{name: req.body.categoryName.toUpperCase(),description:req.body.description});
        res.redirect('/admin/orders');
    } catch (error) {
        console.log(error.message);
    }
}

const deletecateg=async(req,res)=>{
    try {
        const productId = req.params.id;
        const productdata=await Category.findOne({_id:productId})
        await Category.deleteOne({_id:productdata._id});
        await product.deleteOne({category:productId})

        res.redirect('/admin/orders');
       
    } catch (error) {
        console.log(error.message);
    }
}


module.exports={
    getaddcategory,
    getcategory,
    editcategoryload,
    geteditcategory,
    deletecateg,
}