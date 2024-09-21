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

        console.log(brandName)

        const newBrand = new Brand({
            name: brandName,
            multiVar: multiVar,
            rowLabel: rowLabel,
            colLabel: colLabel
        });

        await newBrand.save();

        res.json({msg: brandName + " brand created!"})

    }
    catch(err){
        console.error("Error creating brand:", err);
        res.status(500).json({ message: "Internal server error!!(createBrand)" });
    }
}



module.exports = {getAllCategories, createCategory, getAllBrands, createBrand}