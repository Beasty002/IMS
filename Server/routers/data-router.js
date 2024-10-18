const express = require("express");

const router = express.Router();

const datac = require("../controllers/data-controller");

router.get("/", (req, res) => {
  res.send("Welcome to plywood IMSs api!");
});

router
  .route("/category")
  .get(datac.getAllCategories)
  .post(datac.createCategory)
  .delete(datac.delCategory)
  .patch(datac.editCategory);
router.route("/brandList").post(datac.getSpecificBrand);
router
  .route("/brand")
  .get(datac.getAllBrands)
  .post(datac.createBrand)
  .delete(datac.delBrand)
  .patch(datac.editBrand);

router.route("/rename").put(datac.renameBrand)

router.route("/sales")
  .get(datac.getAllSales)
  .post(datac.salesEntry);


router.route("/getSpecificSale").post(datac.getSpecificSale)

router.route("/purchase")
  .post(datac.addPurchase)

router.route("/getPastWeekSales").get(datac.getPastWeekSales); 
router.route("/getPastMonthSales").get(datac.getPastMonthSales); 
router.route("/getPastYearSales").get(datac.getPastYearSales); 
// router.route("/getSundaySales").get(datac.getSundaySales); 
// router.route("/getSaturdaySales").get(datac.getSaturdaySales); 
router.route("/getSalesByWeekday").post(datac.getSalesByWeekday); 

router.route("/item").post(datac.addType); 

router.route("/type").delete(datac.delType);

router.route("/column")
    .post(datac.addColumn)
    .put(datac.editColumn)
    .delete(datac.delColumn); 
router.route("/getLabels").post(datac.getLabels); 
router.route("/getColLabel").post(datac.getColLabel);

router.route("/getAllStocks").get(datac.getAllStocks)
router.route("/getTable").post(datac.getTable)

router.route("/stock").get(datac.getTotalStock)
router.route("/editStock").post(datac.editStock)

router.route("/code").post(datac.getCodes)

router.route("/colData").post(datac.getSpecCol)


module.exports = router;
