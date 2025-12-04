const express = require("express")
const router = express.Router()
const atividadesController = require("../controllers/atividadesController")
const auth = require("../middleware/requireLogin")

// Página inicial das atividades
router.get("/atividades", auth, atividadesController.index)

// Criar nova atividade
router.post("/atividades", auth, atividadesController.criar)

// Marca uma atividade como concluída
router.post("/atividades/marcar-completa", auth, atividadesController.marcarCompletada)

// Excluir atividade
router.post("/atividades/excluir", auth, atividadesController.excluir)

// Marca/desmarca atividade como favorita
router.post("/atividades/favoritar", auth, atividadesController.marcarFavorita);

// Editar os dados da tarefa
router.post("/atividades/editar", auth, atividadesController.editar)

module.exports = router
