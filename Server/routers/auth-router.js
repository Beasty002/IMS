const express = require("express");

const router = express.Router();

const authc = require("../controllers/auth-controller");

router.get("/", (req, res) => {
  res.send("Welcome to plywood IMSs auth!");
});

router.route("/login")
    .post(authc.login)
    .patch(authc.checkToken)

module.exports = router