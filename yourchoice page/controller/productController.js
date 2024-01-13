const product=require('../model/productModel');

const Category=require('../model/categoryMode');

const path=require('path');

const sharp=require('sharp');

//------------------------------------------




const addingproductload=async(req,res)=>{
    try {
        const categorydata=await Category.find({});
        res.render('addingproduct',{categorys:categorydata,message:""});
    } catch (error) {
        console.log(error.message);
    }
}



const getaddingproduct=async(req,res)=>{

   
           
    try {

        const existproduct=await product.findOne({name:req.body.productName});
        
        if(existproduct){
            res.status(404).send('<h1>category already exist</h1>')
        }else{
            const{productName,quantity,discription,categorys,price,brand,date}=req.body
            const filename=[]
            
            const selectedCategory=await Category.findOne({name:categorys})

            const data=await Category.find({is_listed:true});

            if(quantity<=0){
                return res.render('addingproduct',{messageqty:"Quantity not valid.",categorys:data,productName:productName,quantity:quantity,discription:discription,
                price:price,brand:brand});
            }

            if(price<=0){
                return res.render('addingproduct',{messageprice:"Price not valid.",categorys:data,productName:productName,quantity:quantity,discription:discription,
                price:price,brand:brand});
            }
            

            if(req.files.length !==4 ){
                return res.render('addingproduct',{message:"4 image needed.",categorys:data,productName:productName,quantity:quantity,discription:discription,
                price:price,brand:brand});
            }
            //saving images

            for(let i=0;i<req.files.length;i++){
                const imagesPath=path.join(__dirname,'../1adminpropertice/sharpImage',req.files[i].filename)
                
                await sharp(req.files[i].path).resize(800, 1200, { fit: 'fill' }).toFile(imagesPath);
                filename.push(req.files[i].filename);
                
                
            }
            const newProduct=new product({
                name:productName,
                discription,
                quantity,
                price,
                image:filename,
                category:selectedCategory._id,
                brand,
                date,
            })
            await newProduct.save()
            res.redirect("/admin/addproduct");
        };

    } catch (error) {
        console.log(error.message);
    }
}


const addproductload=async(req,res)=>{
    try {
        const productdata=await product.find({});
        res.render('addproduct',{products:productdata});


    } catch (error) {
        console.log(error.message);
    }
}


const productStatus=async(req,res)=>{
    try {
        const productId=req.params.id
        const productdata=await product.findById(productId);

        if (!productdata) {
            return res.status(404).send('<h1>product not found</h1>');
        } 
            let updatedProduct;
            if(productdata.is_listed){
                updatedProduct = await product.findByIdAndUpdate(productId, { $set: { is_listed: false } }, { new: true })
            }else{
                updatedProduct = await product.findByIdAndUpdate(productId, { $set: { is_listed: true } }, { new: true })
            }
            
        res.send({status:'success',products:updatedProduct})
    } catch (error) {
        console.log(error.message);
    }
}


const editingProduct=async(req,res)=>{
    try {
        const id=req.query.productId
        const categorydata=await Category.find({is_listed:true});
        const data=await product.findOne({_id:id});
        if(!data){
            req.flash('message',"product not found")
            return res.redirect(`/admin/editProduct?productId=${id}`);
        }
        res.render('editproduct',{products: data, categ: categorydata});
    } catch (error) {
        console.log(error.message);
    }
}




const geteditProduct = async (req, res) => {
    try {
        const id = req.body.id;
        const { productName, quantity, discription, categorys, price, brand } = req.body;

        const selectedCategory = await Category.findOne({ name: categorys });

        const categorydata1=await Category.find({is_listed:true});
             const datas1=await product.findOne({_id:id});

        // Check if the category is found
        if (!selectedCategory) {
            return res.status(400).send("Selected category not found");
        }

        if(quantity<=0){
            return res.render('editproduct',{messageqty:"Quantity not valid.",products: datas1, categ:categorydata1,productName:productName,quantity:quantity,discription:discription,
            price:price,brand:brand});
        }

        if(price<=0){
            return res.render('editproduct',{messageprice:"Price not valid.",products: datas1, categ:categorydata1,productName:productName,quantity:quantity,discription:discription,
            price:price,brand:brand});
        }

         
        if(req.files.length !== 4){
            
            
             
             
                return res.render('editproduct',{message:"4 image needed.",products: datas1, categ:categorydata1 ,productName:productName,quantity:quantity,discription:discription,
                price:price,brand:brand});
            
        }

        let filenames = [];

        
        if (req.files && req.files.length > 0) {          
            for (let i = 0; i < Math.min(req.files.length, 4); i++) {               
                const imagePath = path.join(__dirname, '../1adminpropertice/sharpImage', req.files[i].filename);
                await sharp(req.files[i].path).resize(800, 1200, { fit: 'fill' }).toFile(imagePath);
                filenames.push(req.files[i].filename);
            }
        }

        // Initialize updateData
        const updateData = { name: productName, discription, quantity, price, category: selectedCategory._id, brand };

        // Update product information
        await product.findByIdAndUpdate({ _id: id }, updateData);

        // Update images only if filenames are available
        if (filenames.length > 0) {
            // Replace existing images with new ones
            await product.findByIdAndUpdate({ _id: id }, { $set: { image: filenames } });
        }

        req.flash('message', "Product updated successfully");
        res.redirect('/admin/addproduct');
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
};



const deleteproduct=async(req,res)=>{
    try {

        const productId = req.params.productId;
        await product.deleteOne({_id:productId});


        
        res.redirect('/admin/addproduct');



        
    } catch (error) {
        console.log(error.message);
    }
}




module.exports={
    addingproductload,
    getaddingproduct,
    addproductload,
    productStatus,
    editingProduct,
    geteditProduct,
    deleteproduct

}