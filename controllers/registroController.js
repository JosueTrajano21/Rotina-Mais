// registro (paciente e psicólogo)
const Paciente = require('../models/paciente')
const Psicologo = require('../models/psicologo')

module.exports = {

    // Exibe a página de registro   
    mostrarRegistro: (req, res) =>{
        res.render('pages/Registro', {
            titulo: 'Registro',
            css: 'registro.css',
            erro: null
        })
    },

    // Processa o envio do formulário de registro   
    registrar: async (req, res) =>{
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
            
            // Cria e salva o usuário conforme o tipo
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

            // Redireciona para o login após registrar
            return res.redirect('/login');

        }catch (error){
            console.log(error)
            res.render("pages/registro", {
                titulo: "Login",
                css: "login.css",
                erro: "Erro ao registrar."
            })
        }
    }
}

