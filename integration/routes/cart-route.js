const express = require("express")
const router = express.Router()
const cartController = require("../controllers/cart-controller")
const authenticate = require("../middlewares/authenticate")

router.get("/all", cartController.findCart)
router.post("/add", cartController.create)
router.put("/updatestatus", cartController.updateCart)
router.put("/updatequantity", cartController.updateQuantity)
router.delete("/delete", cartController.deleteCart)
router.get("/transactions", cartController.getTransactions)

module.exports = router