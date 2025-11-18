const express = require("express")

const adminRoutes = require("./routes/psicologoGeral")
const pacienteRoutes = require("./routes/atividades")

const app = express()

app.set("view engine", "ejs")
app.set("views", "./views")

app.use(express.static("public"));

const PORT = 3000

app.get("/", (req, res) => {
    res.render("pages/home")
})

app.get('/login', (req, res) => {
    res.render('pages/login', { titulo: 'Login', css: 'login.css' });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`)
})