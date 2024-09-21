const path = require("path")
const Category = require("../models/category-model")
const Brand = require("../models/brand-model")
const { Collection } = require("mongoose")

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

const delCategory = async(req,res) =>{
    try{
        const delCat = req.body.delCat

        if (!delCat){
            console.log("No such category found!")
            return res.json({ err: "No such category found!"});
        }

        await Category.deleteOne({ title: delCat});

        return res.json({msg: delCat+" category deleted!"});

    }
    catch(err){
        console.error("Error deleting category:", err);
        res.status(500).json({ message: "Internal server error!!(delCat)" });
    }
}

const getAllBrands = async (req,res) => {
    try{
        const brands = await Brand.find()

        if (!brands || brands.length == 0)
        {
            return res.status(404).json({err: "No brands found!"});
        }

        return res.json({ brands: brands});
    }
    catch(err){
        console.log("error in fetching brands!")
    }
}

const createBrand = async (req,res) => {
    try{
        const {brandName, multiVar, rowLabel, colLabel } = req.body

        let newBrand;

        if (multiVar === 0 || multiVar === true){
            newBrand = new Brand({
                brandName: brandName,
                multiVar: multiVar,
                rowLabel: rowLabel,
                colLabel: colLabel
            });
        }
        else{
            newBrand = new Brand({
                brandName: brandName,
                multiVar: multiVar,
            });
        }

        await newBrand.save();

        res.json({msg: `${brandName} brand created!`})

    }
    catch(err){
        console.error("Error creating brand:", err);
        res.status(500).json({ message: "Internal server error!!(createBrand)" });
    }
}

const delBrand = async (req,res) =>{
    try{
        const delBrandId = req.body.delBrandId

        if (!delBrandId || delBrandId == null){
            console.log("No such brand found!")
            return res.json({ err: "No such brand found!"});
        }

        const delBrand = await Brand.findById({_id:delBrandId})
        const delBrandName = delBrand.brandName;

        await Brand.deleteOne({ _id: delBrandId});

        return res.json({msg: delBrandName +" brand deleted!"});

    }
    catch(err){
        console.error("Error deleting category:", err);
        res.status(500).json({ message: "Internal server error!!(delBrand)" });
    }
}



module.exports = {getAllCategories, createCategory,delCategory, getAllBrands, createBrand, delBrand}