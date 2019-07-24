const express = require("express")
const router = express.Router()
const userRouter = require("./user-route")
const productRouter = require('./product-route')
const cartRouter = require("./cart-route")
const images = require("../helpers/images")


router.use("/users", userRouter)
router.use("/products", productRouter)
router.use("/cart", cartRouter)
// router.post('/googleCloudStorage', 
//     images.multer.single('image'), 
//     images.sendUploadToGCS,
//     (req,res,next)=>{
//         let imageLink = req.file.cloudStoragePublicUrl
//         res.status(200).json(imageLink)
//     }
// )


module.exports = router