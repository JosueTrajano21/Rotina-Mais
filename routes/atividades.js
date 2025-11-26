const express = require("express")
const router = express.Router()
const atividadesController = require("../controllers/atividadesController")
const auth = require("../middleware/requireLogin")


router.get("/", auth, atividadesController.index)
router.post('/', auth, atividadesController.criar)

module.exports = router
