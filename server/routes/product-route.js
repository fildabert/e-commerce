const express = require("express")
const router = express.Router()
const authentication = require("../middlewares/authenticate")
const authorization = require("../middlewares/authorization")
const productController = require("../controllers/product-controller")

router.get("/all", productController.findAll)
router.post("/add", authentication, authorization, productController.create)
router.put("/edit", authentication, authorization, productController.update)
router.delete("/delete", authentication, authorization, productController.delete)
router.put("/decrement", authentication, productController.decrement)

module.exports = router