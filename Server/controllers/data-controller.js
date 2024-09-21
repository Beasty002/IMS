const path = require("path")
const Category = require("../models/category-model")

const getAllCategories = async (req,res) => {
    try{
        const categories = await Category.find()

        if (!categories || categories.length == 0)
        {
            return res.status(404).json({err: "No categories found!"});
        }

        return res.json({ cats: categories});
    }
    catch(err){
        console.log("error in fetching categories!")
    }
}

const createCategory = async (req,res) => {
    try{
        const cat = req.body.category

        console.log(cat)

        const newCat = new Category({
            title: cat
        });

        await newCat.save();

        res.json({msg: cat + " category created!"})

    }
    catch(err){
        console.error("Error creating category:", err);
        res.status(500).json({ message: "Internal server error!!(createCat)" });
    }
}


module.exports = {getAllCategories, createCategory}