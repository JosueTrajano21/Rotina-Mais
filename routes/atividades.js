const express = require("express")
const router = express.Router()
const atividadesController = require("../controllers/atividadesController")
const auth = require("../middleware/requireLogin")


router.get("/", auth, atividadesController.index)
router.post('/', auth, atividadesController.criar)
router.post("/marcar-completa", atividadesController.marcarCompletada)
router.post("/excluir", auth, atividadesController.excluir)
router.post("/favoritar", auth, atividadesController.marcarFavorita);

module.exports = router
