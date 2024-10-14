const path = require("path");
const Category = require("../models/category-model");
const Brand = require("../models/brand-model");
const Sales = require("../models/sales-model");
const SalesRecord = require("../models/sale-record-model");
const Type = require("../models/type-model");
const Column = require("../models/column-model");
const Stock = require("../models/stock-model");
const Purchase = require("../models/purchase-model");

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
    const { delCat } = req.body;

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
        await Stock.deleteMany({ parentBrandId: brandId });
        await Sales.deleteMany({ sBrandId: brandId });

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

    const allStockData = await Stock.find({ parentCat: categoryName });
    var stockByBrand = {};

    for (var brand of requiredBrand) {
      stockByBrand[brand.brandName] = 0;
    }

    for (var stock of allStockData) {
      const brand = stock.parentBrand;

      // Initialize the object for the brand if it doesn't exist
      if (!stockByBrand[brand]) {
        stockByBrand[brand] = 0;
      }

      // Accumulate the stock for each brand
      stockByBrand[brand] += stock.stock;
    }

    console.log(stockByBrand);

    return res
      .status(202)
      .json({ brands: requiredBrand, stockByBrand: stockByBrand });
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

    parentCat =
      parentCat.charAt(0).toUpperCase() + parentCat.slice(1).toLowerCase();

    const checkBrand = await Brand.findOne({
      brandName: brandName,
      parentCategory: parentCat,
    });
    if (checkBrand) {
      return res.json({ err: `${brandName} already exists` });
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
    await Column.deleteMany({ brandId: delBrandId });
    await Type.deleteMany({ brandId: delBrandId });
    await Stock.deleteMany({ parentBrandId: delBrandId });
    await Sales.deleteMany({ sBrandId: delBrandId });

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
  try {
    const newBrandName = req.body.rename;
    const renameBrandId = req.body._id;

    const renameBrand = await Brand.findById({ _id: renameBrandId });

    renameBrand.brandName = newBrandName;

    await renameBrand.save();

    return res.status(200).json({ msg: `${newBrandName} renamed!` });
  } catch (err) {
    console.error("Error renaming Brand:");
    res.status(500).json({ message: "Internal server error!!(renameBrand)" });
  }
};

const getBrand = async (req, res) => {
  try {
  } catch (err) {}
};

// ////////////////////////////////////// SALES /////////////////////////////////////////////////// //
const salesEntry = async (req, res) => {
  try {
    // console.log(req.body);
    var saleIds = [];
    var count = 0;

    const sales = req.body;

    console.log(sales);

    for (var sale of sales.addInput) {
      count++;

      const sCat = sale.category;
      const sBrand = sale.brand;

      const forBrandId = await Brand.findOne({
        parentCategory: sCat,
        brandName: sBrand,
      });
      const brandId = forBrandId._id;

      const sRow = sale.rowLabel;
      const sCol = sale.colLabel;
      const sQty = sale.counter;

      if (isNaN(sQty)) {
        return res.json({
          err: `Quantity of sale no.${count} is not a number`,
        });
      }

      var newSaleEntry = new Sales({
        sCategory: sCat,
        sBrand: sBrand,
        sBrandId: brandId,
        sRowLabel: sRow,
        sColLabel: sCol,
        sQty: sQty,
      });

      // return res.json(sQty)

      var newSale = await newSaleEntry.save();

      saleIds.push(newSale._id);
    }
    // console.log(saleIds)

    const newSalesEntry = new SalesRecord({
      saleIds: saleIds,
    });

    await newSalesEntry.save();

    return res.json({ msg: "New Sale Added!" });
  } catch (err) {
    console.error("Error sales entry:");
    res.status(500).json({ message: "Internal server error!!(salesEntry)" });
  }
};

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

const getSpecificSale = async (req, res) => {
  try {
    const { day } = req.body;
    var specificSales = [];

    const saleRecords = await SaleRecordModel.find();

    for (var sale of saleRecords) {
      var dos = sale.dos;
      dos = dos.toISOString();

      dos = dos.split("T")[0];
      // console.log(dos)

      if (dos === day) {
        for (var saleId of sale.saleIds) {
          var specificSale = await Sales.findById(saleId);

          specificSales.push(specificSale);
        }
      }
    }

    return res.status(200).json({ msg: specificSales });
  } catch (err) {
    console.error("Error get specific sale by day:");
    res
      .status(500)
      .json({ message: "Internal server error!!(getSpecificSale)" });
  }
};

const getPastWeekSales = async (req, res) => {
  try {
    var soldQty = 0;
    const currDate = new Date();

    const aWeekAgo = new Date();
    aWeekAgo.setDate(currDate.getDate() - 7);

    const pastWeekSales = await SalesRecord.find({
      dos: { $gte: aWeekAgo },
    });

    // console.log(pastWeekSales)
    const saleIds = pastWeekSales.map((sale) => sale.saleIds).flat();
    // return res.json({saleIds: saleIds})

    for (var saleId of saleIds) {
      const sale = await Sales.findById({ _id: saleId });

      ////////////////////// TOOO BEEE CONTTINUUUEEEDDD //////////////////////////////
    }

    return res.json({ pastWeekSales: pastWeekSales });
  } catch (err) {
    console.error("Error past week sales");
    res.json({ message: "Internal server error!!(getPastWeekSales)" });
  }
};

const getPastMonthSales = async (req, res) => {
  try {
    const currDate = new Date();

    const aMonthAgo = new Date();
    aMonthAgo.setDate(currDate.getDate() - 30);

    const pastMonthSales = await SalesRecord.find({
      dos: { $gte: aMonthAgo },
    });

    return res.json({ pastMonthSales: pastMonthSales });
  } catch (err) {
    console.error("Error past month sales");
    res.json({ message: "Internal server error!!(getPastMonthSales)" });
  }
};

const getPastYearSales = async (req, res) => {
  try {
    const currDate = new Date();

    const aYearAgo = new Date();
    aYearAgo.setDate(currDate.getDate() - 365);

    const pastYearSales = await SalesRecord.find({
      dos: { $gte: aYearAgo },
    });

    return res.json({ pastYearSales: pastYearSales });
  } catch (err) {
    console.error("Error past year sales");
    res.json({ message: "Internal server error!!(getPastYearSales)" });
  }
};

const getSalesByWeekday = async (req, res) => {
  try {
    const weekday = req.body.weekday;

    if (!weekday || weekday < 1 || weekday > 7) {
      return res
        .status(400)
        .json({
          message:
            "Invalid weekday. Please provide a value between 1 (Sunday) and 7 (Saturday).",
        });
    }

    const salesByWeekday = await SalesRecord.find({
      $expr: { $eq: [{ $dayOfWeek: "$dos" }, parseInt(weekday)] },
    });

    return res.json({ salesByWeekday });
  } catch (err) {
    console.error("Error fetching sales by weekday");
    res
      .status(500)
      .json({ message: "Internal server error!! (getSalesByWeekday)" });
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

const addType = async (req, res) => {
  try {
    const type = req.body.item;
    const id = req.body._id;

    const checkType = await Type.findOne({ type: type, brandId: id });

    if (checkType || checkType != null) {
      console.log("not working");
      return res.status(409).json({ err: "Type already exists" });
    }

    const newType = new Type({
      type: type,
      brandId: id,
    });

    await newType.save();

    return res.status(202).json({ msg: `${type} added` });
  } catch (err) {
    console.error("Error add type");
    res.json({ message: "Internal server error!!(addtype)" });
  }
};

const delType = async (req, res) => {
  try {
    console.log(req.body);

    const { rowKey, brandId } = req.body;

    const delRow = await Type.findOne({ type: rowKey, brandId: brandId });

    if (!delRow) {
      return res.status(404).json({ err: `${rowKey} not found!` });
    }

    await delRow.deleteOne({ type: rowKey, brandId: brandId });
    await Stock.deleteOne({ parentBrandId: brandId, rowLabel: rowKey });

    return res.status(200).json({ msg: `${rowKey} deleted successfully!` });
  } catch (err) {
    console.error("Error del type");
    res.json({ message: "Internal server error!!(deltype)" });
  }
};

const addColumn = async (req, res) => {
  try {
    const bodies = req.body;
    console.log("adcol",bodies)
    // return

    for (var body of bodies) {
      console.log(body);
      const col = body.columnName;
      const id = body.specificId;

      const checkCol = await Column.findOne({ column: col, brandId: id });
      console.log(checkCol);

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

const editColumn = async (req, res) => {
  try {
    const { id, brandId, columnName } = req.body;

    const oldCol = await Column.findById(id);
    const oldColName = oldCol.column;

    await Column.findByIdAndUpdate(id, { column: columnName });

    const updateCorrStock = await Stock.findOne({
      colLabel: oldColName,
      parentBrandId: brandId,
    });

    updateCorrStock.colLabel = columnName;
    // console.log(updateCorrStock)
    // return
    await updateCorrStock.save();

    return res.status(200).json({ msg: `${columnName} updated` });
  } catch (err) {
    console.error("Error edit col");
    res.json({ message: "Internal server error!!(editCol)" });
  }
};

const delColumn = async (req, res) => {
  try {
    // console.log(req.body)
    const { columnId, brandId } = req.body;

    const forDelColName = await Column.findById(columnId);

    const delCol = await Column.deleteOne({ _id: columnId });

    const delColName = forDelColName.column;
    console.log(delColName);
    const toDelStock = await Stock.findOne({
      parentBrandId: brandId,
      colLabel: delColName,
    });
    if (toDelStock) {
      const delStock = await Stock.deleteOne({
        parentBrandId: brandId,
        colLabel: delColName,
      });
      console.log("delsto: ", delStock);
    }

    await delCol.deleteOne({ _id: columnId });
  } catch (err) {
    console.error("Error del col");
    res.json({ message: "Internal server error!!(delCol)" });
  }
};

const getLabels = async (req, res) => {
  try {
    const brandId = req.body.brandId;

    const chosenBrand = await Brand.findById({ _id: brandId });
    const rowLabel = chosenBrand.rowLabel;
    const colLabel = chosenBrand.colLabel;

    const chosenType = await Type.find({ brandId: brandId });
    const chosenColumn = await Column.find({ brandId: brandId });

    // console.log(chosenType)

    if (!chosenType || !chosenColumn) {
      return res.json({ err: "No such label found!" });
    }

    return res.json({
      rowLabel: rowLabel,
      colLabel: colLabel,
      type: chosenType,
      column: chosenColumn,
    }); // if more than one type chosenType is an ARRAY
  } catch (err) {
    console.error("Error get row label");
    res.json({ message: "Internal server error!!(getRowLabel)" });
  }
};

const getColLabel = async (req, res) => {
  try {
    const brandId = req.body.brandId;

    const chosenColumn = await Column.find({ brandId: brandId });
    // console.log(chosenColumn)

    if (!chosenColumn) {
      return res.json({ err: "No such type found!" });
    }

    return res.json({ msg: chosenColumn }); // if more than one type chosenType is an ARRAY
  } catch (err) {
    console.error("Error get col label");
    res.status(500).json({ message: "Internal server error!!(getColLabel)" });
  }
};

const addPurchase = async (req, res) => {
  try {
    // console.log(req.body);
    var purchaseIds = [];
    const bodies = req.body.addInput;
    // console.log(bodies)
    // return

    for (var body of bodies) {
      const cat = body.category;
      const brand = body.brand;

      const forBrandId = await Brand.findOne({
        parentCategory: cat,
        brandName: brand,
      });
      const brandId = forBrandId._id;

      const rowLabel = body.rowLabel;
      const colLabel = body.colLabel;

      const stock = body.counter;

      const newStock = new Stock({
        stock: stock,
        parentCat: cat,
        parentBrand: brand,
        parentBrandId: brandId,
        rowLabel: rowLabel,
        colLabel: colLabel,
      });

      var aStock = await newStock.save();

      purchaseIds.push(aStock._id);
    }

    const newPurchase = new Purchase({
      purchaseIds: purchaseIds,
    });

    await newPurchase.save();

    return res.json({ msg: "New Stocks Added!" });
  } catch (err) {
    console.error("Error add purchase");
    res.status(500).json({ message: "Internal server error!!(addPurchase)" });
  }
};

const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find();

    return res.json({ stocks: stocks });
  } catch (err) {
    console.error("Error get all stock");
    res.status(500).json({ message: "Internal server error!!(getAllStocks)" });
  }
};

// const getTable = async (req,res) => {
//   try{
//     const cat = req.body.cat
//     const brand = req.body.brand

//     const brandName = await Brand.findOne({brandName:brand, parentCategory:cat})
//     const brandId = brandName._id

//     const allTypes = await Type.find({ brandId: brandId})
//     const allCols = await Column.find({ brandId: brandId})
//     // console.log(allCols)

//     const allEntries = await Stock.find({ parentCat: cat, parentBrand: brand});

//     var matrix = {};
//     // var rowData = [];
//     // var checkRow= [];
//     // var checkCol= [];

//     // for (var row of allEntries){
//     //   var rowLabel = row.rowLabel
//     //   var colLabel = row.colLabel
//     //   var stock = row.stock

//     //   // console.log(rowLabel)

//     //   // check if rowlabel already exists if not new row created
//     //   if (!checkRow.includes(rowLabel)) {
//     //     checkRow.push(rowLabel);
//     //     matrix[rowLabel] = {}
//     //   }

//     //   if (matrix[rowLabel][colLabel]) {
//     //     matrix[rowLabel][colLabel] += stock;
//     //   } else {
//     //     matrix[rowLabel][colLabel] = stock
//     //   }
//     //   // rowData.push(row.stock)
//     // }

//     allTypes.forEach(type => {
//         matrix[type.rowLabel] = {};  // Create an object for each type
//         allCols.forEach(col => {
//             matrix[type.rowLabel][col.colLabel] = 0;  // Initialize each cell with 0 to aggregate stock values
//         });
//     });

//     // Populate the matrix with stock data and aggregate if necessary
//     allEntries.forEach(entry => {
//         const rowLabel = entry.rowLabel;  // Assuming this refers to the type
//         const colLabel = entry.colLabel;  // Assuming this refers to the column
//         const stock = entry.stock;        // The stock value to be added to the matrix

//         if (matrix[rowLabel] && matrix[rowLabel][colLabel] !== undefined) {
//             // If the matrix already has a stock value, aggregate (add) the new stock value
//             matrix[rowLabel][colLabel] += stock;
//         } else {
//             // Otherwise, set the stock value directly
//             matrix[rowLabel][colLabel] = stock;
//         }
//     });

//     return res.json({matrix:matrix})
//   }
//   catch(err){
//     console.error("Error get table");
//     res.status(500).json({ message: "Internal server error!!(getTable)" });
//   }
// }

const getTable = async (req, res) => {
  try {
    const cat = req.body.cat;
    const brand = req.body.brand;

    const brandName = await Brand.findOne({
      brandName: brand,
      parentCategory: cat,
    });
    const brandId = brandName._id;

    const allTypes = await Type.find({ brandId: brandId });
    const allCols = await Column.find({ brandId: brandId });

    const allEntries = await Stock.find({ parentCat: cat, parentBrand: brand });

    var matrix = {};

    for (let i = 0; i < allTypes.length; i++) {
      const type = allTypes[i];
      matrix[type.type] = {}; // create a row for each type

      for (let j = 0; j < allCols.length; j++) {
        const col = allCols[j];
        matrix[type.type][col.column] = 0; // init each cell to 0
      }
    }
    console.log(allEntries);

    for (let i = 0; i < allEntries.length; i++) {
      const entry = allEntries[i];
      const rowLabel = entry.rowLabel;
      const colLabel = entry.colLabel;
      const stock = entry.stock;

      if (matrix[rowLabel] && matrix[rowLabel][colLabel] !== undefined) {
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

const editStock = async (req, res) => {
  try {
    const { rowKey, updatedData, categoryName, brandName, brandId } = req.body;

    for (var col in updatedData) {
      var specificStock = await Stock.findOne({
        parentCat: categoryName,
        parentBrand: brandName,
        parentBrandId: brandId,
        rowLabel: rowKey,
        colLabel: col,
      });

      if (specificStock) {
        specificStock.stock = updatedData[col];

        await specificStock.save();
      }
      // if no previous stock of the column, create one
      else if (!specificStock && updatedData[col] != 0) {
        const newStock = new Stock({
          stock: updatedData[col],
          parentCat: categoryName,
          parentBrand: brandName,
          parentBrandId: brandId,
          rowLabel: rowKey,
          colLabel: col,
        });

        await newStock.save();
      }
    }
    return res.status(200).json({ msg: "Stock updated successfully!" });
  } catch (err) {
    console.error("Error edit stock");
    res.status(500).json({ message: "Internal server error!!(editStock)" });
  }
};

const getCodes = async (req, res) => {
  try {
    console.log(req.body);
    const { rowValue, brandId } = req.body;

    const forTypeId = await Type.findOne({ type: rowValue, brandId: brandId });
    if (!forTypeId) {
      return res.status(404).json({ err: `${rowValue} does not exist!` });
    }

    const typeId = forTypeId._id;

    const codes = await Column.find({ brandId: brandId, typeId: typeId });
    if (!codes) {
      return res.status(404).json({ err: `${forTypeId.type} has no codes!` });
    }

    return res.status(200).json({ msg: codes, typeId: typeId });
  } catch (err) {
    console.error("Error get codes");
    res.status(500).json({ message: "Internal server error!!(getCodes)" });
  }
};

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
};
