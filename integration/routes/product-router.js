const express = require("express")
const router = express.Router()
const productController = require("../controllers/product-controller")
const images = require("../helpers/images")
const authenticate = require("../middlewares/authenticate")
const authorization = require("../middlewares/authorization")


router.get("/all", productController.findAll)
router.post("/add", authenticate, authorization, images.multer.single("image"), images.sendUploadToGCS, productController.create)
router.put("/edit/:id", authenticate, authorization, images.multer.single("image"), images.sendUploadToGCS, productController.update)
router.patch("/editquantity/:id", authenticate, productController.decrement)
router.delete("/delete/:id", authenticate, authorization, productController.delete)


module.exports = router