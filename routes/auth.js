const express = require('express')
const router = express.Router()
const Paciente = require('../models/paciente')

router.get('/login', (req, res) =>{
    res.render('pages/login', {
        titulo: 'Login',
        css: 'login.css',
        erro: null
    })
})


router.post('/login', async (req, res) =>{
    try{    
        const {email, senha} = req.body
        console.log('tentando login com: ', email)

        const paciente = await Paciente.buscarPorEmail(email)

        if (!paciente) {
            console.log('Paciente não encontrado')
            return res.render('pages/login', {
                titulo: 'Login',
                css: 'login.css',
            })
        }

        const senhaCorreta = await paciente.verificarSenha(senha)
        if (!senhaCorreta) {
            console.log('Senha incorreta')
            return res.render('pages/login', {
                titulo: 'Login',
                css: 'login.css',
            })
        }

        console.log('Login realizado!')
        res.send(`
            <h1>Login Bem-Sucedido! 🎉</h1>
            <p>Bem-vindo, <strong>${paciente.name}</strong>!</p>
            <p>Email: ${paciente.email}</p>
            <p>ID: ${paciente.id}</p>
            <a href="/">Voltar para Home</a>
        `)


    }catch (error){
        console.log('❌ Erro no login:', error)
        res.render('pages/login', {
            titulo: 'Login',
            css: 'login.css',
        })
    }

})

module.exports = router;

