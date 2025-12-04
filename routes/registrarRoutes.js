const express = require('express')
const router = express.Router()
const registroController = require("../controllers/registroController")

// Exibe a página de registro
router.get('/Registro', registroController.mostrarRegistro)

// Recebe os dados do formulário e cria um novo usuário
router.post('/Registro', registroController.registrar)

module.exports = router