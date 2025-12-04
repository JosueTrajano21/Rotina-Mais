const express = require('express')
const router = express.Router()
const loginController = require("../controllers/loginController")

router.get('/login', loginController.mostrarLogin) // Mostra a página login
router.post('/login', loginController.login) // Efetua o login
router.get('/logout', loginController.logout) // Encerra a sessão e desloga o usuário

module.exports = router;

