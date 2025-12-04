const express = require("express")
const router = express.Router()
const psicologoGeral = require("../controllers/psicologoController")
const auth = require("../middleware/requireLogin")

// Lista todos os pacientes do psicólogo
router.get("/psicologo_geral/", auth, psicologoGeral.index);

// Mostra detalhes e atividades de um paciente específico
router.get("/psicologo_geral/paciente/:id", auth, psicologoGeral.acompanharPaciente);

// Adiciona um paciente no psicologo
router.post("/psicologo_geral", auth, psicologoGeral.adicionar)  

// Remove a vinculação entre psicólogo e paciente
router.post("/psicologo_geral/excluir", auth, psicologoGeral.excluir)

module.exports = router
