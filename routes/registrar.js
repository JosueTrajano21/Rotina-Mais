const express = require('express')
const router = express.Router()
const Paciente = require('../models/paciente')
const Psicologo = require('../models/psicologo')

router.get('/registro', (req, res) =>{
    res.render('pages/registro', {
        titulo: 'Registro',
        css: 'registro.css',
        erro: null
    })
})

router.post('/registro', async (req, res) =>{
    try{
        const {nome, email, senha, tipo} = req.body
        console.log("Tipo de usuário:", tipo)

        if (!nome || !email || !senha) {
            return res.render('pages/registro', {
                titulo: 'Registro',
                css: 'registro.css',
                erro: 'Preencha todos os campos.'
            })
        }

        if (!tipo) {
            return res.render('pages/registro', {
                titulo: 'registro',
                css: 'registro.css',
                erro: 'Selecione se você é Paciente ou Psicólogo.'
            })
        }

        let existe

        if (tipo === "paciente") {
            existe = await Paciente.buscarPorEmail(email)
        }

        if (tipo === "psicologo") {
            existe = await Psicologo.buscarPorEmail(email)
        }

        if (existe) {
            return res.render('pages/registro', {
                titulo: 'registro',
                css: 'registro.css',
                erro: 'Email já está sendo utilizado.'
            })
        }
        
        if (tipo === "paciente") {
            const paciente = new Paciente({
                name: nome,
                email: email,
                senha: senha
            })

            await paciente.salvar();

        }else{
            const psicologo = new Psicologo({
                name: nome,
                email: email,
                senha: senha
            });

            await psicologo.salvar();
        }

        return res.redirect('/login');

    }catch (error){

        console.log(error)
        res.render("pages/registro", {
            titulo: "Login",
            css: "login.css",
            erro: "Erro ao registrar."
        })
    }
})

module.exports = router