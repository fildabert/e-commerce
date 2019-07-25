const express = require("express")
const router = express.Router()
const userController = require("../controllers/user-controller")
const authenticate = require("../middlewares/authenticate")


router.post("/register", userController.register)
router.post("/login", userController.login)
router.patch("/topup", authenticate, userController.topUp)

module.exports = router