const express = require("express")
const router = express.Router()
const productController = require("../controllers/product-controller")
const images = require("../helpers/images")

router.get("/all", productController.findAll)
router.post("/add", images.multer.single("image"), images.sendUploadToGCS, productController.create)
router.put("/edit/:id", images.multer.single("image"), images.sendUploadToGCS, productController.update)
router.patch("/editquantity/:id", productController.decrement)
router.delete("/delete/:id", productController.delete)


module.exports = router