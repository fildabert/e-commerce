const express = require("express")
const router = express.Router()
const authentication = require("../middlewares/authenticate")
const authorization = require("../middlewares/authorization")
const productController = require("../controllers/product-controller")
const images = require("../helpers/images")

router.get("/all", productController.findAll)
router.post("/add", authentication, authorization, images.multer.single("image"), images.sendUploadToGCS, productController.create)
router.put("/edit/:id", authentication, authorization, images.multer.single("image"), images.sendUploadToGCS, productController.update)
router.delete("/delete/:id", authentication, authorization, productController.delete)
router.put("/decrement/:id", authentication, productController.decrement)

module.exports = router