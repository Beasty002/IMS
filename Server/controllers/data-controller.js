const path = require("path");
const Category = require("../models/category-model");
const Brand = require("../models/brand-model");
const Sales = require("../models/sales-model");
const SalesRecord = require("../models/sale-record-model")
const Type = require("../models/type-model")
const Column = require("../models/column-model")
const Stock = require("../models/stock-model")
const Purchase = require("../models/purchase-model")
const RecordStock = require("../models/record-stock")
const RecordSale = require("../models/record-sale")

const { Collection } = require("mongoose");
const { isString } = require("util");
const SaleRecordModel = require("../models/sale-record-model");

///////////////////////////// CATEGORIES //////////////////////////////
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    
    if (!categories || categories.length == 0) {
      return res.status(404).json({ err: "No categories found!" });
    }

    var catStocks = {}
    for (var category of categories){
      var catTitle = category.title
      
      catStocks[catTitle] = 0;
    }
    
    for (var category of categories){
      var catTitle = category.title
      
      const forCatStocks = await RecordStock.find({category: catTitle})
      
      for(var forCatStock of forCatStocks){
        
        const catStock = forCatStock.totalStock
        
        catStocks[catTitle] += catStock
      }
    }

    return res.json({ cats: categories , catStocks: catStocks});
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
    const {delCat} = req.body;

    if (!delCat) {
      console.log("No such category found!");
      return res.json({ err: "No such category found!" });
    }

    const delBrands = await Brand.find({ parentCategory: delCat });
    
    if (delBrands.length > 0) {
      for (const brand of delBrands) {
        const brandId = brand._id;
        await Column.deleteMany({ brandId });
        await Type.deleteMany({ brandId });
        // await Stock.deleteMany({ parentBrandId: brandId });
        // await Sales.deleteMany({ sBrandId: brandId });
        
        await Brand.deleteOne({ _id: brandId });
      }
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

    const allStockData = await RecordStock.find({category: categoryName})
    var stockByBrand = {};

    for (var brand of requiredBrand) {
      stockByBrand[brand.brandName] = 0
    }

    for (var stock of allStockData) {
      const brand = stock.brand;
      
      // Initialize the object for the brand if it doesn't exist
      if (!stockByBrand[brand]) {
        stockByBrand[brand] = 0;
      }
      
      // Accumulate the stock for each brand
      stockByBrand[brand] += stock.totalStock;
    }

    console.log(stockByBrand)

    return res.status(202).json({ brands: requiredBrand , stockByBrand: stockByBrand});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
};

const createBrand = async (req, res) => {
  try {
    let colLabel;
    // console.log(req.body);
    // return

    const brandName = req.body.brandName;
    const multiVar = req.body.multiVar;
    const rowLabel = req.body.rowLabel;

    if (req.body.colLabel) colLabel = req.body.colLabel;

    var parentCat = req.body.parentCat;

    parentCat = parentCat.charAt(0).toUpperCase() + parentCat.slice(1).toLowerCase();

    const checkBrand = await Brand.findOne({ brandName: brandName, parentCategory: parentCat})
    if (checkBrand){
      return res.json({err:  `${brandName} already exists`})
    }
    
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
    await Column.deleteMany({ brandId: delBrandId})
    await Type.deleteMany({ brandId: delBrandId})
    // await Stock.deleteMany({ parentBrandId: delBrandId})
    await RecordStock.deleteMany({ brandId: delBrandId})
    // await Sales.deleteMany({ sBrandId: delBrandId})

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

        const forBrandId = await Brand.findOne({ parentCategory: sCat, brandName: sBrand})
        const brandId = forBrandId._id

        const sRow = sale.rowLabel;
        const sCol = sale.colLabel;
        const sQty = sale.counter;

        if (isNaN(sQty)){
          return res.json({err: `Quantity of sale no.${count} is not a number`})
        }

        if (sQty == 0){
          return res.json({ err: "Selling quantity can not be zero"})
        }
        
        var newSaleEntry = new Sales({
          sCategory: sCat,
          sBrand:sBrand,
          sBrandId: brandId,
          sRowLabel:sRow,
          sColLabel:sCol,
          sQty:sQty
        });


        // return res.json(sQty)

        var newSale = await newSaleEntry.save();

        saleIds.push(newSale._id)

        const forRecordStock = await RecordStock.findOne({ brandId:brandId, brand:sBrand,category:sCat,rowLabel:sRow, colLabel:sCol })
        if (!forRecordStock || forRecordStock.length ===0 ){
          return res.status(404).json({
            err: `brandId: ${brandId}, brand: ${sBrand}, category: ${sCat}, rowLabel: ${sRow}, colLabel: ${sCol} not found`
          });
        }
        else{
          if (forRecordStock.totalStock < sQty){
            return res.status(400).json({err: `Not enough stock available! Total Stock: ${forRecordStock.totalStock}`})
          }
          forRecordStock.totalStock -= sQty

          await forRecordStock.save()
        }

        const forRecordSale = await RecordStock.findOne({ brandId:brandId, brand:sBrand,category:sCat,rowLabel:sRow, colLabel:sCol })
        if (!forRecordSale || forRecordSale.length ===0 ){
          return res.status(404).json({
            err: `brandId: ${brandId}, brand: ${sBrand}, category: ${sCat}, rowLabel: ${sRow}, colLabel: ${sCol} not found`
          });
        }
        else{
          // if (forRecordSale.soldQty < sQty){
          //   return res.status(400).json({err: `Not enough stock available! Total Stock: ${forRecordStock.totalStock}`})
          // }
          forRecordSale.soldQty += sQty

          await forRecordStock.save()
        }


        
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

// const getAllSales = async (req,res) => {
//     try{

//         const sales = await Sales.find();

//         for (var i=0;i<sales.length;i++){
//           if (sale.sCategory && sale.sBrand && sRowLabel && sColLabel ){
//             sales[i] =+ sale.sQty
//           }
//         }

//         return res.json({ msg: sales})
//     }
//     catch(err){
//       console.error("Error getallsales :");
//       res.status(500).json({ message: "Internal server error!!(getAllSales)" });
//     }
// }

const getAllSales = async (req, res) => {
  try {
    const sales = await Sales.find();

    // Create a dictionary to accumulate quantities by category, brand, row, and column
    const salesMap = {};

    for (var i = 0; i < sales.length; i++) {
      const sale = sales[i];
      
      // Construct a unique key based on sCategory, sBrand, sRowLabel, and sColLabel
      const key = `${sale.sCategory}-${sale.sBrand}-${sale.sRowLabel}-${sale.sColLabel}`;
      
      // Initialize the quantity for this combination if not already done
      if (!salesMap[key]) {
        salesMap[key] = {
          sCategory: sale.sCategory,
          sBrand: sale.sBrand,
          sRowLabel: sale.sRowLabel,
          sColLabel: sale.sColLabel,
          sQty: 0,
        };
      }
      
      // Add the current sale's quantity to the accumulated total
      salesMap[key].sQty += sale.sQty;
    }

    // Convert the salesMap back into an array of objects
    const aggregatedSales = Object.values(salesMap);

    return res.json({ msg: aggregatedSales });
  } catch (err) {
    console.error("Error getAllSales:");
    res.status(500).json({ message: "Internal server error!!(getAllSales)" });
  }
};

const getSpecificSale = async (req,res) => {
  try{
    var { day, title } = req.body
    
    title = title.toLowerCase()
    
    var model,schema,givenId,givenDate


    if (title==="sales"){
      model = SaleRecordModel
      schema = Sales
      givenId = "saleIds"
      givenDate = "dos"
      
    }
    else if (title==="purchases"){
      model = Purchase
      schema = Stock
      givenId = "purchaseIds"
      givenDate = "dop"
      
    }else{
      return res.status(400).json({ err: `No such entry found for ${title}`})
    }
    
    var specificSales = []

    const saleRecords = await model.find();

    if (!saleRecords || saleRecords.length ===0){
      return res.status(404).json({ saleAvailable: false})
    }

    for (var sale of saleRecords){
      var dos = sale[givenDate]
      dos = dos.toISOString();

      dos = dos.split('T')[0]

      if (dos === day){
        for (var saleId of sale[givenId]){
          // console.log("SAleid: ", saleId)
          
          var specificSale = await schema.findById(saleId)
          // console.log(specificSale)
          
          specificSales.push(specificSale)
        }
      }
    }

    return res.status(200).json({ msg: specificSales})
  }
  catch(err){
    console.error("Error get specific sale by day:");
    res.status(500).json({ message: "Internal server error!!(getSpecificSale)" });
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

    const checkType = await Type.findOne({type: type, brandId: id})

    if (checkType || checkType != null){
      console.log("not working")
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
    console.error("Error add type");
    res.json({ message: "Internal server error!!(addtype)" });
  
  }
}

const delType = async (req,res) => {
  try{
    
    const { rowKey, brandId } = req.body
    
    const delRow = await Type.findOne({ type: rowKey, brandId: brandId})
    
    if (!delRow){
      return res.status(404).json({ err: `${rowKey} not found!`})
    }

    await delRow.deleteOne({ type: rowKey, brandId: brandId })
    await RecordStock.deleteOne({ brandId: brandId, rowLabel: rowKey})

    return res.status(200).json({ msg: `${rowKey} deleted successfully!`})
  }
  catch(err){
    console.error("Error del type");
    res.json({ message: "Internal server error!!(deltype)" });
  }
}

const addColumn = async (req, res) => {
  try {
    const bodies = req.body;
    // console.log("adcol",bodies)
    // // return

    for (var body of bodies) {
      // console.log(body);
      const col = body.columnName;
      const id = body.specificId;

      const checkCol = await Column.findOne({ column: col, brandId: id });
      // console.log(checkCol);

      const typeName = body.typeName;
      // only create those column which do not exist already
      if (!checkCol) {
        var newCol;

        if (typeName) {
          const forTypeId = await Type.findOne({type: typeName, brandId: id})
          const typeId = forTypeId._id

          newCol = new Column({
            column: col,
            brandId: id,
            typeId: typeId,
          });
        } else {
          newCol = new Column({
            column: col,
            brandId: id,
          });
        }
        
        await newCol.save();

      }
    }

    return res.status(200).json({ msg: `Columns added successfully!` });
  } catch (err) {
    console.error("Error add col");
    res.json({ message: "Internal server error!!(addCol)" });
  }
};

const editColumn = async (req,res) => {
  try{
    
    const { id, brandId, columnName } = req.body

    const oldCol = await Column.findById(id)
    const oldColName = oldCol.column

    await Column.findByIdAndUpdate(id, { column: columnName })

    const updateCorrStock = await Stock.findOne({ colLabel: oldColName, parentBrandId: brandId})
    const updateCorrRecordStock = await RecordStock.findOne({ colLabel: oldColName, brandId: brandId})
    
    updateCorrStock.colLabel = columnName
    await updateCorrStock.save();
    updateCorrRecordStock.colLabel = columnName
    await updateCorrRecordStock.save()
    // console.log(updateCorrStock)
    // return

    return res.status(200).json({msg: `${columnName} updated`})
  }
  catch(err){
    console.error("Error edit col");
    res.json({ message: "Internal server error!!(editCol)" });
  }
}

const delColumn = async (req,res) => {
  try{
    // console.log(req.body)
    const { columnId, brandId } = req.body


    const forDelColName = await Column.findById(columnId)

    const delCol = await Column.deleteOne( { _id: columnId})

    const delColName = forDelColName.column
    console.log(delColName)
    const toDelStock = await RecordStock.findOne({ brand: brandId, colLabel: delColName})
    if (toDelStock){

      const delStock = await RecordStock.deleteOne({ brandId: brandId, colLabel: delColName})
      console.log("delsto: ",delStock)
    }

    await delCol.deleteOne({ _id: columnId})


  }
  catch(err){
    console.error("Error del col");
    res.json({ message: "Internal server error!!(delCol)" });
  }
}

const getLabels = async (req,res) => {
  try{
    const brandId = req.body.brandId
    // console.log(req.body);
    // return;

    const chosenBrand = await Brand.findById({ _id: brandId })
    const rowLabel = chosenBrand.rowLabel
    const colLabel = chosenBrand.colLabel
    const multiVar = chosenBrand.multiVar

    const chosenType = await Type.find({ brandId: brandId })
    const chosenColumn = await Column.find({ brandId: brandId })

    if (!chosenType || !chosenColumn){
      return res.json({ err: "No such label found!"})
    }

    return res.json({ rowLabel:rowLabel, colLabel:colLabel, type: chosenType, column: chosenColumn , multiVar: multiVar}) // if more than one type chosenType is an ARRAY


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
    // return

    for (var body of bodies){
  
      // if 
      const requiredFields = ['category', 'brand', 'rowLabel', 'colLabel','counter'];
      const missingFields = requiredFields.filter(field => !body[field]);

      if (missingFields.length) {
        return res.status(404).json({ err: `${missingFields.join(', ')} not selected!` });
      }

      const { category: cat, brand, rowLabel, colLabel } = body;

      const forBrandId = await Brand.findOne({ parentCategory: cat, brandName: brand });
      if (!forBrandId) {
        return res.status(404).json({ err: 'Brand not found!' });
      }

      const brandId = forBrandId._id;
  
      const stock = body.counter
  
      const newStock = new Stock({
        stock: stock,
        parentCat: cat,
        parentBrand: brand,
        parentBrandId: brandId,
        rowLabel: rowLabel,
        colLabel: colLabel
      });
  
  
      var aStock = await newStock.save();

      purchaseIds.push(aStock._id);

      const checkStock = await RecordStock.findOne({ brandId:brandId, brand:brand,category:cat,rowLabel:rowLabel, colLabel:colLabel})
      if (checkStock){
        checkStock.totalStock += stock

        await checkStock.save()
      }else{
        const recordStock = new RecordStock({
          totalStock:stock,
          brandId:brandId, 
          brand:brand,
          category:cat,
          rowLabel:rowLabel, 
          colLabel:colLabel
        });

        await recordStock.save()
      }
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

const getAllStocks = async (req,res) =>{
  try{
    const stocks = await Stock.find();

    return res.json({stocks: stocks})
  }
  catch(err){
    console.error("Error get all stock");
    res.status(500).json({ message: "Internal server error!!(getAllStocks)" });
  }
}

const getTable = async (req, res) => {
  try {
    
    const cat = req.body.cat;
    const brand = req.body.brand;
    
    const brandName = await Brand.findOne({ brandName: brand, parentCategory: cat });
    
    const brandId = brandName._id;
    
    // Find all types for the brand
    const allTypes = await Type.find({ brandId: brandId });
    // Find all columns for the brand
    const allCols = await Column.find({ brandId: brandId });
    
    // Find all entries for the brand and category
    const allEntries = await RecordStock.find({ category: cat, brand: brand });
    
    var matrix = {};
    
    for (let i = 0; i < allTypes.length; i++) {
      const type = allTypes[i];
      matrix[type.type] = {}; // create a row for each type
      
      
      for (let j = 0; j < allCols.length; j++) {
        const col = allCols[j];
        matrix[type.type][col.column] = 0; // init each cell to 0
      }
    }
    
    for (let i = 0; i < allEntries.length; i++) {
      const entry = allEntries[i];
      const rowLabel = entry.rowLabel
      const colLabel = entry.colLabel
      const stock = entry.totalStock
      console.log(entry)
      // return
      
      if (matrix[rowLabel] && matrix[rowLabel][colLabel] !== null) {
        matrix[rowLabel][colLabel] += stock;
      } else {
        matrix[rowLabel][colLabel] = stock;
      }
    }

    return res.json({ matrix: matrix });
  } catch (err) {
    console.error("Error get table");
    res.status(500).json({ message: "Internal server error!!(getTable)" });
  }
};

const editStock = async (req,res) =>{
  try{
    if(req.body.typeName){
      
      const { rowKey, updatedData,brandId,categoryName,brandName,typeName} = req.body
      
      var specificRecordStock = await RecordStock.findOne({brandId: brandId,rowLabel:typeName,colLabel:rowKey })
      
      if (specificRecordStock){
        specificRecordStock.totalStock = parseInt(updatedData)
        
        // await specificRecordStock.save()
      }
      else if (!specificRecordStock && updatedData!=0){
        const newRecordStock = new RecordStock({
          totalStock:parseInt(updatedData),
          brandId:brandId, 
          brand:brandName,
          category:categoryName,
          rowLabel:typeName, 
          colLabel:rowKey
        });

        await newRecordStock.save()
      }

      return res.status(200).json({msg: "Stock updated successfully!"})

    }else{
      const { rowKey, updatedData,categoryName,brandName,brandId} = req.body
      for (var col in updatedData){

        var specificRecordStock = await RecordStock.findOne({brandId: brandId,rowLabel:rowKey,colLabel:col })
        // console.log("😊🤣😊🤣",updatedData[col])
        // return

        if (specificRecordStock){
          specificRecordStock.totalStock = parseInt(updatedData[col])
          
          await specificRecordStock.save()
        }
        else if (!specificRecordStock && updatedData[col]!=0){
          const newRecordStock = new RecordStock({
              totalStock:parseInt(updatedData[col]),
              brandId:brandId, 
              brand:brandName,
              category:categoryName,
              rowLabel:rowKey, 
              colLabel:col
            });
  
            await newRecordStock.save()
        }
   
      }
      return res.status(200).json({msg: "Stock/s updated successfully!"})
    }
    
  }
  catch(err){
    console.error("Error edit stock");
    res.status(500).json({ message: "Internal server error!!(editStock)" });
  }
}

// const getCodes = async(req,res) => {
//   try{
//     const {rowValue, brandId} = req.body;
    
//     const stock = await RecordStock.findOne({ brandId: brandId, rowLabel: rowValue });

//     const forTypeId = await Type.findOne({ type: rowValue, brandId: brandId });
//     if (!forTypeId){
//       return res.status(404).json({ err: `${rowValue} does not exist!` });
//     }

//     const typeId = forTypeId._id;

//     const codes = await Column.find({ brandId: brandId, typeId: typeId });
//     if (!codes || codes.length === 0){
//       return res.status(404).json({ err: `${forTypeId.type} has no codes!` });
//     }

//     var codeArr = [];
//     var codeStocks = {};

//     // Initialize each column with a stock value of 0
//     for (let i = 0; i < codes.length; i++) {
//       const col = codes[i];
//       codeStocks[col.column] = 0;
//     }
//     console.log('stock😒😒😒😒', stock);
//     // return

//     if (stock || stock!=null){
//       var checkCol = stock.colLabel;
//       if (!codeArr.includes(checkCol)){
//         codeArr.push(checkCol);
//       }
//       if (codeStocks[checkCol]) {
//         codeStocks[checkCol] = parseInt(codeStocks[checkCol]) + stock.totalStock
//       } else {
//         codeStocks[checkCol] = stock.totalStock
//       }
//     }
    
//     return res.status(200).json({ msg: codes, typeId: typeId, codeStocks: codeStocks });
//   }
//   catch(err){
//     console.error("Error get codes");
//     res.status(500).json({ message: "Internal server error!!(getCodes)" });
//   }
// }

const getCodes = async(req,res) => {
  try{
    // console.log(req.body)
    const {rowValue, brandId} = req.body;

    const stockArr = await RecordStock.find({ brandId: brandId, rowLabel: rowValue });
    console.log('stock', stockArr);

    const forTypeId = await Type.findOne({ type: rowValue, brandId: brandId });
    if (!forTypeId){
      return res.status(404).json({ err: `${rowValue} does not exist!` });
    }

    const typeId = forTypeId._id;

    const codes = await Column.find({ brandId: brandId, typeId: typeId });
    if (!codes || codes.length === 0){
      return res.status(404).json({ err: `${forTypeId.type} has no codes!` });
    }

    var codeArr = [];
    var codeStocks = {};

    // Initialize each column with a stock value of 0
    for (let i = 0; i < codes.length; i++) {
      const col = codes[i];
      codeStocks[col.column] = "0";
    }

    // Update stock based on rowLabel and colLabel
    for (var stock of stockArr){
      var checkCol = stock.colLabel;
      if (!codeArr.includes(checkCol)){
        codeArr.push(checkCol);
      }
      if (codeStocks[checkCol]) {
        codeStocks[checkCol] = (parseInt(codeStocks[checkCol]) + stock.totalStock).toString();
      } else {
        codeStocks[checkCol] = stock.totalStock.toString();
      }
    }

    return res.status(200).json({ msg: codes, typeId: typeId, codeStocks: codeStocks });
  }
  catch(err){
    console.error("Error get codes");
    res.status(500).json({ message: "Internal server error!!(getCodes)" });
  }
}


const getSpecCol = async (req,res) => {
  try{
    const {rowLabel, brandId} = req.body
    console.log(req.body);
    // return;
    
    const forTypeId = await Type.findOne({ type: rowLabel, brandId: brandId})
    if (!forTypeId){
      return res.status(404).json({err: "No such type found!"})
    }
    const typeId = forTypeId._id
    
    const forColArr = await Column.find({ brandId: brandId, typeId: typeId})
    if (!forColArr){
      return res.status(404).json({ err: "No such column found!"})
    }
    
    var colArr = [];
    for (var col of forColArr){
      colArr.push(col.column)
    }

    return res.status(200).json({msg: colArr})

  }
  catch(err){
    console.error("Error get specific columns");
    res.status(500).json({ message: "Internal server error!!(getSpecCol)" });
  }
}

const getTotalStock = async(req,res) => {
  try{
    var totalStock = 0;
    const allStocks = await RecordStock.find()
    if (!allStocks || allStocks.length ===0){
      return res.status(404).json({ err: "No stock available!"})
    }
    for (var stock of allStocks )
    {
      totalStock += stock.totalStock
    }
    return res.status(200).json({msg: totalStock})
  }
  catch(err){
    console.error("Error get total stock");
    res.status(500).json({ message: "Internal server error!!(getTotalStock)" });
  }
}

const checkStock = async (req,res) => {
  try{
    const allStocks = await RecordStock.find()
    if (!allStocks || allStocks.length ===0){
      return res.status(404).json({ err: "No stock available!"})
    }

    var allCategories = []
    const forAllCategories = await Category.find()
    for (var cat of forAllCategories){
      allCategories.push(cat.title)
    }
    // console.log(allCategories)
    
    var stockByBrand = {};

    for (var categoryName of allCategories){
      const allStockData = await RecordStock.find({category: categoryName})

      for (var stock of allStockData) {
        const brand = stock.brand;
        const rowLabel = stock.rowLabel;
        const colLabel = stock.colLabel;
        
        const brandCategoryKey = `${brand} ${categoryName} ${rowLabel} (${colLabel})`;        
        if (!stockByBrand[brandCategoryKey]) {
          stockByBrand[brandCategoryKey] = 0;
        }
        
        stockByBrand[brandCategoryKey] += stock.totalStock;
        
      }
    }
    // console.log("🤣🤣🤣🤣",stockByBrand)
    
    var lowStock = []
    for (var key in stockByBrand) {
      if (stockByBrand[key] < 11) {
        lowStock.push({
          brandCategory: key,
          stock: stockByBrand[key]
        });
      }
    }

    lowStock.sort((a, b) => a.stock - b.stock);
    return res.json({lowStock})
  }
  catch(err){
    console.error("Error check stock");
    res.status(500).json({ message: "Internal server error!!(checkStock)" });
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
  getSpecificSale,
  getPastWeekSales,
  getPastMonthSales,
  getPastYearSales,

  // getSundaySales,
  // getSaturdaySales,
  getSalesByWeekday,

  addPurchase,

  addType,
  delType,

  addColumn,
  editColumn,
  delColumn,

  getLabels,
  getColLabel,

  getAllStocks,

  getTable,

  editStock,

  getCodes,
  getSpecCol,

  getTotalStock,

  checkStock,
};