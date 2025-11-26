const express = require("express")
const router = express.Router()
const psicologoGeral = require("../controllers/psicologoController")
const auth = require("../middleware/requireLogin")

router.get("/", auth, psicologoGeral.index);
router.get("/paciente/:id", auth, psicologoGeral.acompanharPaciente);
router.post("/", auth, psicologoGeral.adicionar)    
router.post("/excluir", auth, psicologoGeral.excluir)

module.exports = router
