// login, registro, logout.
const Paciente = require('../models/paciente')
const Psicologo = require('../models/psicologo')

module.exports = {

    // Renderiza a página de login
    mostrarLogin: (req, res) =>{
      res.render("pages/login", {
            titulo: "Login",
            css: "login.css",
            erro: null
        })
    },

    // Processa o login (POST /login)
    login: async (req, res) => {
      try {
            const { email, senha, tipo } = req.body

            // Validar os campos
            if (!email || !senha) {
                return res.render("pages/login", {
                    titulo: "Login",
                    css: "login.css",
                    erro: "Preencha todos os campos."
                })
            }

            // Usuário deve escolher entre psicólogo ou paciente
            if (!tipo) {
                return res.render("pages/login", {
                    titulo: "Login",
                    css: "login.css",
                    erro: "Selecione Paciente ou Psicólogo."
                })
            }

            // Busca no BD conforme o tipo
            let usuario = tipo === "paciente" 
                ? await Paciente.buscarPorEmail(email)
                : await Psicologo.buscarPorEmail(email)

            // Se email não for encontrado
            if (!usuario) {
                return res.render("pages/login", {
                    titulo: "Login",
                    css: "login.css",
                    erro: "E-mail ou senha incorreto."
                })
            }

            // Verifica se a senha está correta
            const senhaCorreta = await usuario.verificarSenha(senha)
            if (!senhaCorreta) {
                return res.render("pages/login", {
                    titulo: "Login",
                    css: "login.css",
                    erro: "E-mail ou senha incorreto."
                })
            }

            // Salva as informações na sessão
            req.session.user = {
                id: usuario.id,
                tipo
            }

            // Envia para a página conforme o tipo
            if (tipo === "paciente") return res.redirect("/atividades")
            if (tipo === "psicologo") return res.redirect("/psicologo_geral")

        } catch (error) {
            console.log("Erro no login:", error)

            // Erro inesperado
            return res.render("pages/login", {
                titulo: "Login",
                css: "login.css",
                erro: "Erro interno no servidor."
            })
        }
    },

    // Destroi a sessão e faz logout
    logout(req, res) {
        req.session.destroy(() => {
            res.clearCookie("connect.sid") // Remove cookie de sessão
            res.redirect("/login")
        })
    }

}

