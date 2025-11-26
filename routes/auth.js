const express = require('express')
const router = express.Router()
const Paciente = require('../models/paciente')
const Psicologo = require('../models/psicologo')

router.get('/login', (req, res) =>{
    res.render('pages/login', {
        titulo: 'Login',
        css: 'login.css',
        erro: null
    })
})

router.post('/login', async (req, res) =>{
    try{    
        const {email, senha, tipo} = req.body

        if (!email || !senha) {
            return res.render('pages/login', {
                titulo: 'Login',
                css: 'login.css',
                erro: 'Preencha todos os campos.'
            })
        }

        if (!tipo) {
            return res.render("pages/login", {
                titulo: "Login",
                css: "login.css",
                erro: "Selecione Paciente ou Psicólogo."
            });
        }

        let usuario
        
        if (tipo === "paciente") {
            usuario = await Paciente.buscarPorEmail(email);
        } else if (tipo === "psicologo") {
            usuario = await Psicologo.buscarPorEmail(email);
        }

        if (!usuario) {
            console.log('Paciente não encontrado')
            return res.render('pages/login', {
                titulo: 'Login',
                css: 'login.css',
                erro: 'E-mail ou senha incorreto.'
            })
        }

        const senhaCorreta = await usuario.verificarSenha(senha)
        if (!senhaCorreta) {
            console.log('Senha incorreta')
            return res.render('pages/login', {
                titulo: 'Login',
                css: 'login.css',
                erro: 'E-mail ou senha incorreto.'
            })
        }

        // Salvando sessão  
        req.session.user = {
            id: usuario.id,
            tipo: tipo
        };

        // Redirecionando
        if (tipo === "paciente") {
            return res.redirect("/atividades");
        }

        if (tipo === "psicologo") {
            return res.redirect("/psicologo_geral");
        }

    }catch (error){
        console.log('❌ Erro no login:', error)
        res.render('pages/login', {
            titulo: 'Login',
            css: 'login.css',
        })
    }

})

router.post('/logout', (req, res) => {
    const userType = req.session.user?.tipo
    
    req.session.destroy((err) => {
        if (err) {
            console.log('❌ Erro ao fazer logout:', err)
            // Mesmo com erro, tenta redirecionar
            return res.redirect(userType === 'psicologo' ? '/psicologo_geral' : '/atividades')
        }
        
        // Limpa o cookie
        res.clearCookie('connect.sid')
        
        // Mensagem de sucesso (opcional)
        req.session = null
        
        res.redirect('/login')
    })
})

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login')
    })
})
module.exports = router;

