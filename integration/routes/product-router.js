const express = require("express")
const router = express.Router()
const productController = require("../controllers/product-controller")

router.get("/all", productController.findAll)
router.post("/add", productController.create)
router.put("/edit", productController.update)
router.delete("/delete", productController.delete)


module.exports = router