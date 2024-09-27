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
  .post(datac.createBrand)
  .delete(datac.delBrand)
  .patch(datac.editBrand);

router.route("/sales")
  .get(datac.getAllSales)
  .post(datac.salesEntry);

module.exports = router;
