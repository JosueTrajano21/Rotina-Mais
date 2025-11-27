const express = require("express")
const app = express()
require("dotenv").config()
const session = require("express-session")

// Sessão
app.use(session({
    secret: "segredo-super-seguro",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }
}))

// Configurações
app.set("view engine", "ejs")
app.set("views", "./views")
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(express.json());

// Rotas
const atividadesRoutes = require("./routes/atividades")
const authRoutes = require("./routes/auth")
const registrarRoutes = require("./routes/registrar")
const psicologoGeralRoutes = require("./routes/psicologoGeralRoutes")

// Rota principal
app.get("/", (req, res) => {
    res.render("pages/home", {
        titulo: "Home",
        css: "home.css"
    })
})

// controllers
app.use("/atividades", atividadesRoutes)
app.use("/", authRoutes)
app.use("/", registrarRoutes)
app.use("/psicologo_geral", psicologoGeralRoutes)


const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`))
