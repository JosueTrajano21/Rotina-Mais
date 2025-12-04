const express = require("express")
const app = express()
require("dotenv").config()
const session = require("express-session")

// Sessão
app.use(session({
    secret: process.env.SESSION_SECRET || "segredo",
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

// Importação de rotas
const pacienteRoutes = require("./routes/pacienteRoutes")
const loginRoutes = require("./routes/loginRoutes")
const registrarRoutes = require("./routes/registrarRoutes")
const psicologoRoutes = require("./routes/psicologoRoutes")

// Rota principal
app.get("/", (req, res) => {
    res.render("pages/home", {
        titulo: "Home",
        css: "home.css"
    })
})

//  Rotas principais
app.use("/", pacienteRoutes)
app.use("/", loginRoutes)
app.use("/", registrarRoutes)
app.use("/", psicologoRoutes)

// Inicialização do servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`))
