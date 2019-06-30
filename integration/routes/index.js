const express = require("express")
const router =  express.Router()
const userRouter = require("./user-router")
const productRouter = require("./product-router")

router.use("/users", userRouter)
router.use("/products", productRouter)

module.exports = router