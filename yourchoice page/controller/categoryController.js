const User = require('../model/userModel');

const Category = require('../model/categoryMode');

const product = require('../model/productModel');

const Cart = require('../model/cartModel');




const ordersload = async (req, res) => {
    try {
        const categData = await Category.find({});
        res.render('category', { categ: categData });
    } catch (error) {
        console.log(error.message);
    }
}

const addcategoryload = async (req, res) => {
    try {
        res.render('addcategory')
    } catch (error) {
        console.log(error.message);
    }
}



const verifyaddcategory = async (req, res) => {
    try {

        const existCategory = await Category.findOne({ name: req.body.categoryName.toUpperCase() });

        if (existCategory) {

            req.flash('message', "Category already exists");
            res.redirect('/admin/addcategory');
        } else {
            const { categoryName, description } = req.body

            const newCateg = new Category({
                name: categoryName.toUpperCase(),
                description,
            });

            await newCateg.save();
            res.redirect('/admin/category');

        }
    } catch (error) {
        console.log(error.message);
    }
}

const verifyeditcategory = async (req, res) => {
    try {
        const categoryId = req.params.id

       

        const categData = await Category.findById(categoryId);
        if (!categData) {

            return res.status(404).send('category not found');

        }
        let updatedCategory;

        
        if (categData.is_listed) {
            updatedCategory = await Category.findByIdAndUpdate(categoryId, { $set: { is_listed: false } }, { new: true })
        } else {
            updatedCategory = await Category.findByIdAndUpdate(categoryId, { $set: { is_listed: true } }, { new: true })
        }
        res.send({ status: 'success', categories: updatedCategory });

    } catch (error) {
        console.log(error.message);
    }
}


const editcategoryload = async (req, res) => {

    try {
        const categoryid = req.query.categid;
        const data = await Category.findOne({ _id: categoryid });
        if (!data) {
            req.flash('message', 'Category not found.')
            return res.redirect("/admin/editcategory")
        }
        res.render('editcategory', { categories: data });

    } catch (error) {

    }

}



const geteditcategory = async (req, res) => {
    try {
        const existingCategory = await Category.findOne({ name: req.body.categoryName });

        if (existingCategory && existingCategory._id.toString() !== req.body.id) {
            req.flash('message', 'Ctegory alredy exists.');
            return res.redirect('/admin/editcategory?categid=' + req.body.id);

        }
        await Category.findByIdAndUpdate({ _id: req.body.id }, { name: req.body.categoryName.toUpperCase(), description: req.body.description });
        res.redirect('/admin/category');
    } catch (error) {
        console.log(error.message);
    }
}

const deletecateg = async (req, res) => {
    try {
        const productId = req.params.id;
        const productdata = await Category.find({ _id: productId })
        await Category.deleteOne({ _id: productdata });

        const productid = await product.find({ category: productId });

        //console.log(productid);

        const productIdsToDelete = productid.map(product => product._id);

        // Delete items from the 'Cart' collection where 'product_id' matches any of the product IDs
        await Cart.deleteMany({ 'items.product_id': { $in: productIdsToDelete } });

        await product.deleteMany({ category: productId });
        res.redirect('/admin/category');

    } catch (error) {
        console.log(error.message);
    }
}

//----------------orders
module.exports = {
    ordersload,
    addcategoryload,
    verifyaddcategory,
    verifyeditcategory,
    editcategoryload,
    geteditcategory,
    deletecateg,
}