const express = require("express")
const router =  express.Router()
const userRouter = require("./user-router")
const productRouter = require("./product-router")
const cartRouter = require("./cart-route")

router.use("/users", userRouter)
router.use("/products", productRouter)
router.use("/carts", cartRouter)

module.exports = router