const path = require("path");
const Category = require("../models/category-model");
const Brand = require("../models/brand-model");
const Sales = require("../models/sales-model");
const SalesRecord = require("../models/sale-record-model")
const Type = require("../models/type-model")
const Column = require("../models/column-model")
const Stock = require("../models/stock-model")
const Purchase = require("../models/purchase-model")

const { Collection } = require("mongoose");
const { isString } = require("util");

///////////////////////////// CATEGORIES //////////////////////////////
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    if (!categories || categories.length == 0) {
      return res.status(404).json({ err: "No categories found!" });
    }

    return res.json({ cats: categories });
  } catch (err) {
    console.log("error in fetching categories!");
  }
};

const createCategory = async (req, res) => {
  try {
    const cat = req.body.category;

    // console.log(cat);

    const newCat = new Category({
      title: cat,
    });

    await newCat.save();

    res.json({ msg: cat + " category created!" });
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).json({ message: "Internal server error!!(createCat)" });
  }
};

const delCategory = async (req, res) => {
  try {
    const delCat = req.body.delCat;

    if (!delCat) {
      console.log("No such category found!");
      return res.json({ err: "No such category found!" });
    }

    await Category.deleteOne({ title: delCat });

    return res.json({ msg: delCat + " category deleted!" });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ message: "Internal server error!!(delCat)" });
  }
};

const editCategory = async (req, res) => {
  try {
    const editCatId = req.body.editCatId;
    const editCatName = req.body.editCatName;

    const toUpdateCat = await Category.findById({ _id: editCatId });

    if (!toUpdateCat) {
      return res.json({ err: "No such category found!" });
    }

    toUpdateCat.title = editCatName;

    toUpdateCat.save();

    return res.json({ updated: toUpdateCat });
  } catch (err) {
    console.error("Error editing category:");
    res.status(500).json({ message: "Internal server error!!(editCat)" });
  }
};

////////////////////////////////////// BRANDS ///////////////////////////////////////////////////

const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();

    if (!brands || brands.length == 0) {
      return res.status(404).json({ err: "No brands found!" });
    }

    return res.json({ brands: brands });
  } catch (err) {
    console.log("error in fetching brands!");
  }
};

const getSpecificBrand = async (req, res) => {
  try {
    const { categoryName } = req.body;
    const requiredBrand = await Brand.find({ parentCategory: categoryName });

    if (requiredBrand.length === 0) {
      return res
        .status(400)
        .json({ msg: "No data related to given brand found" });
    }

    return res.status(202).json({ brands: requiredBrand });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
};

const createBrand = async (req, res) => {
  try {
    let colLabel;
    // console.log(req.body);

    const brandName = req.body.brandName;
    const multiVar = req.body.multiVar;
    const rowLabel = req.body.rowLabel;

    if (req.body.colLabel) colLabel = req.body.colLabel;

    const parentCat = req.body.parentCat;

    let newBrand;

    if (multiVar === "yes") {
      newBrand = new Brand({
        brandName: brandName,
        multiVar: multiVar,
        rowLabel: rowLabel,
        colLabel: colLabel,
        parentCategory: parentCat,
      });
    } else if (multiVar === "no") {
      newBrand = new Brand({
        brandName: brandName,
        multiVar: multiVar,
        rowLabel: rowLabel,
        parentCategory: parentCat,
      });
    } else {
      return res.json({ msg: "in createBrand conditionals" });
    }

    await newBrand.save();

    res.json({ msg: `${brandName} brand created!` });
  } catch (err) {
    console.error("Error creating brand:", err);
    res.status(500).json({ message: "Internal server error!!(createBrand)" });
  }
};

const delBrand = async (req, res) => {
  try {
    const delBrandId = req.body.delBrandId;

    if (!delBrandId || delBrandId == null) {
      console.log("No such brand found!");
      return res.json({ err: "No such brand found!" });
    }

    const delBrand = await Brand.findById({ _id: delBrandId });
    const delBrandName = delBrand.brandName;

    await Brand.deleteOne({ _id: delBrandId });

    return res.json({ msg: delBrandName + " brand deleted!" });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ message: "Internal server error!!(delBrand)" });
  }
};

const editBrand = async (req, res) => {
  try {
    const editBrandId = req.body.editBrandId;

    const editBrandName = req.body.editBrandName;
    const editBrandMultiVar = req.body.editBrandMultiVar;
    const editBrandRowLabel = req.body.editBrandRowLabel;
    const editBrandColLabel = req.body.editBrandColLabel;
    const editBrandParentCat = req.body.editBrandParentCategory;

    var toUpdateBrand = await Brand.findById({ _id: editBrandId });

    if (!toUpdateBrand) {
      return res.json({ err: "No such Brand found!" });
    }

    //// only edit the edited
    if (editBrandName) toUpdateBrand.brandName = editBrandName;
    if (editBrandMultiVar) toUpdateBrand.multiVar = editBrandMultiVar;
    if (editBrandRowLabel) toUpdateBrand.rowLabel = editBrandRowLabel;
    if (editBrandColLabel) toUpdateBrand.colLabel = editBrandColLabel;
    if (editBrandParentCat) toUpdateBrand.parentCategory = editBrandParentCat;

    toUpdateBrand.save();

    return res.json({ msg: toUpdateBrand });
  } catch (err) {
    console.error("Error editing Brand:");
    res.status(500).json({ message: "Internal server error!!(editBrand)" });
  }
};

const renameBrand = async (req, res) => {
  try{
    const newBrandName = req.body.rename
    const renameBrandId = req.body._id

    const renameBrand = await Brand.findById({_id: renameBrandId})

    renameBrand.brandName = newBrandName

    await renameBrand.save()

    return res.status(200).json({msg: `${newBrandName} renamed!`})
  } 
  catch(err){
    console.error("Error renaming Brand:");
    res.status(500).json({ message: "Internal server error!!(renameBrand)" });
  }
}

const getBrand = async (req,res) => {
  try{

  }
  catch(err){

  }
}


// ////////////////////////////////////// SALES /////////////////////////////////////////////////// //
const salesEntry = async (req,res) => {
  try{
      // console.log(req.body);
      var saleIds = [];
      var count =0;

      const sales = req.body;

      console.log(sales)

      for(var sale of sales.addInput){
        count++;

        const sCat = sale.category;
        const sBrand = sale.brand;
        const sRow = sale.rowLabel;
        const sCol = sale.colLabel;
        const sQty = sale.counter;

        
        
        if (isNaN(sQty)){
          return res.json({err: `Quantity of sale no.${count} is not a number`})
        }
        
        var newSaleEntry = new Sales({
          sCategory: sCat,
          sBrand:sBrand,
          sRowLabel:sRow,
          sColLabel:sCol,
          sQty:sQty
        });


        // return res.json(sQty)

        var newSale = await newSaleEntry.save();

        saleIds.push(newSale._id)

        
      }
      // console.log(saleIds)


      const newSalesEntry = new SalesRecord({
        saleIds: saleIds
      });     
      

      await newSalesEntry.save()

      return res.json({msg: "New Sale Added!"})
  }
  catch(err){
      console.error("Error sales entry:");
      res.status(500).json({ message: "Internal server error!!(salesEntry)" });
  }
}

const getAllSales = async (req,res) => {
    try{
        const sales = await Sales.find();

        return res.json({ msg: sales})
    }
    catch(err){
      console.error("Error getallsales :");
      res.status(500).json({ message: "Internal server error!!(getAllSales)" });
    }
}

const getPastWeekSales = async (req,res) => {
  try{
    var soldQty = 0;
    const currDate = new Date();

    const aWeekAgo = new Date();
    aWeekAgo.setDate(currDate.getDate() - 7);
      
    const pastWeekSales = await SalesRecord.find({
      dos: { $gte: aWeekAgo}
    });

    // console.log(pastWeekSales)
    const saleIds = pastWeekSales.map(sale => sale.saleIds).flat();
    // return res.json({saleIds: saleIds})

    for (var saleId of saleIds){
      const sale = await Sales.findById({_id: saleId});

      ////////////////////// TOOO BEEE CONTTINUUUEEEDDD //////////////////////////////

    }

    return res.json({pastWeekSales: pastWeekSales})
  }
  catch(err){
    console.error("Error past week sales");
    res.json({ message: "Internal server error!!(getPastWeekSales)" });
  }
}

const getPastMonthSales = async (req,res) => {
  try{
    const currDate = new Date();

    const aMonthAgo = new Date();
    aMonthAgo.setDate(currDate.getDate() - 30);
      
    const pastMonthSales = await SalesRecord.find({
      dos: { $gte: aMonthAgo}
    });

    return res.json({pastMonthSales: pastMonthSales})
  }
  catch(err){
    console.error("Error past month sales");
    res.json({ message: "Internal server error!!(getPastMonthSales)" });
  }
}

const getPastYearSales = async (req,res) => {
  try{
    const currDate = new Date();

    const aYearAgo = new Date();
    aYearAgo.setDate(currDate.getDate() - 365);
      
    const pastYearSales = await SalesRecord.find({
      dos: { $gte: aYearAgo}
    });

    return res.json({pastYearSales: pastYearSales})
  }
  catch(err){
    console.error("Error past year sales");
    res.json({ message: "Internal server error!!(getPastYearSales)" });
  }
}

const getSalesByWeekday = async (req, res) => {
  try {
    const weekday = req.body.weekday;

    if (!weekday || weekday < 1 || weekday > 7) {
      return res.status(400).json({ message: "Invalid weekday. Please provide a value between 1 (Sunday) and 7 (Saturday)." });
    }

    const salesByWeekday = await SalesRecord.find({
      $expr: { $eq: [{ $dayOfWeek: "$dos" }, parseInt(weekday)] }
    });

    return res.json({ salesByWeekday });
  } catch (err) {
    console.error("Error fetching sales by weekday");
    res.status(500).json({ message: "Internal server error!! (getSalesByWeekday)" });
  }
};


// const getSundaySales = async (req,res) => {
//   try{
//     const sundaySales = await SalesRecord.find({
//       $expr: { $eq: [{ $dayOfWeek: "$dos" }, 1] } // MongoDB $dayOfWeek returns 1 for Sunday
//     });

//     return res.json({sundaySales: sundaySales})

//   }
//   catch(err){
//     console.error("Error sun sales");
//     res.json({ message: "Internal server error!!(getSunSales)" });
//   }
// }

// const getSaturdaySales = async (req, res) => {
//   try {
//     const saturdaySales = await SalesRecord.find({
//       $expr: { $eq: [{ $dayOfWeek: "$dos" }, 7] } // MongoDB $dayOfWeek returns 7 for Saturday
//     });

//     return res.json({ saturdaySales: saturdaySales });
//   } catch (err) {
//     console.error("Error sat sales");
//     res.json({ message: "Internal server error!!(getSatSales)" });
//   }
// };


const addType = async (req,res) => {
  try{  

    const type = req.body.item
    const id = req.body._id

    const checkType = await Type.findOne({type: type})

    if (checkType){
      return res.status(409).json({err: "Type already exists"})
    }

    const newType = new Type({
      type: type,
      brandId: id
    });

    await newType.save();

    return res.status(202).json({msg: `${type} added`})
    
  }
  catch(err){
    console.error("Error sat sales");
    res.json({ message: "Internal server error!!(addtype)" });
  
  }
}

const addColumn = async (req,res) => {
  try{
    const bodies = req.body

    for (var body of bodies){

      const col = body.columnName
      const id = body.specificId

      const checkCol = await Column.findOne({ column: col })

      if (checkCol){
        return res.status(409).json({ err: "Column already exists"})
      }
  
      const newCol = new Column({
        column: col,
        brandId: id
      });
  
      await newCol.save();
    }

    return res.status(200).json({msg: `Columns added successfully!`})
  }
  catch(err){
    console.error("Error add col");
    res.json({ message: "Internal server error!!(addCol)" });
  }
}

const getLabels = async (req,res) => {
  try{
    const brandId = req.body.brandId

    const chosenBrand = await Brand.findById({ _id: brandId })
    const rowLabel = chosenBrand.rowLabel
    const colLabel = chosenBrand.colLabel

    const chosenType = await Type.find({ brandId: brandId })
    const chosenColumn = await Column.find({ brandId: brandId })

    // console.log(chosenType)

    if (!chosenType || !chosenColumn){
      return res.json({ err: "No such label found!"})
    }

    return res.json({ rowLabel:rowLabel, colLabel:colLabel, type: chosenType, column: chosenColumn }) // if more than one type chosenType is an ARRAY


  }
  catch(err){
    console.error("Error get row label");
    res.json({ message: "Internal server error!!(getRowLabel)" });
  }
}

const getColLabel = async (req,res) => {
  try{
    const brandId = req.body.brandId

    const chosenColumn = await Column.find({ brandId: brandId })
    // console.log(chosenColumn)

    if (!chosenColumn){
      return res.json({ err: "No such type found!"})
    }

    return res.json({ msg: chosenColumn }) // if more than one type chosenType is an ARRAY
  }
  catch(err){
    console.error("Error get col label");
    res.status(500).json({ message: "Internal server error!!(getColLabel)" });
  }
}

const addPurchase = async (req,res) =>  {
  try{
    // console.log(req.body);
    var purchaseIds = [];
    const bodies = req.body.addInput
    // console.log(bodies)

    for (var body of bodies){

      // console.log(body)
  
      const cat = body.category
      const brand = body.brand
  
      const rowLabel = body.rowLabel
      const colLabel = body.colLabel
  
      const stock = body.counter

      // console.log(stock)
  
      const newStock = new Stock({
        stock: stock,
        parentCat: cat,
        parentBrand: brand,
        rowLabel: rowLabel,
        colLabel: colLabel
      });
  
  
      var aStock = await newStock.save();

      // console.log(aStock._id)
      purchaseIds.push(aStock._id);

    }

    const newPurchase = new Purchase({
      purchaseIds: purchaseIds,
    });

    await newPurchase.save()

    return res.json({msg: "New Stocks Added!"})

  }
  catch(err){
    console.error("Error add purchase");
    res.status(500).json({ message: "Internal server error!!(addPurchase)" });
  }
}



module.exports = {
  getAllCategories,
  createCategory,
  delCategory,
  editCategory,

  getAllBrands,
  createBrand,
  delBrand,
  editBrand,
  renameBrand,
  getSpecificBrand,

  salesEntry,
  getAllSales,
  getPastWeekSales,
  getPastMonthSales,
  getPastYearSales,

  // getSundaySales,
  // getSaturdaySales,
  getSalesByWeekday,

  addPurchase,

  addType,
  addColumn,

  getLabels,
  getColLabel,

};
