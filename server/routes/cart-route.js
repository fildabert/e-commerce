const express = require("express")
const router = express.Router()
const cartController = require("../controllers/cart-controller")
const authenticate = require("../middlewares/authenticate")
const authorize = require("../middlewares/authorization")

router.get("/all", authenticate, cartController.findCart)
router.post("/add", authenticate, cartController.create)
router.put("/updatestatus", authenticate, cartController.updateCart)
router.put("/updatequantity", authenticate, cartController.updateQuantity)
router.delete("/delete", authenticate, cartController.deleteCart)
router.get("/transactions/:status", authenticate, cartController.getTransactions)
router.get("/transactions/admin", authenticate, authorize, cartController.getAllPendingTransactions)
router.patch("/transactions/admin", authenticate, authorize, cartController.updateTransactions)

module.exports = router