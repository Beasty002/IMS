const express = require("express");

const router = express.Router();

const datac = require("../controllers/data-controller")


router.get("/", (req, res) => {
    res.send("Welcome to plywood IMSs api!");
});

router.route("/category").get(datac.getAllCategories).post(datac.createCategory)


module.exports = router;