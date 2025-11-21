const express = require("express")
const router = express.Router()
const app = express()

const adminRoutes = require("./routes/psicologoGeral")
const atividadesRoutes = require("./routes/atividades");


app.set("view engine", "ejs")
app.set("views", "./views")
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/atividades", atividadesRoutes);

const PORT = 3000

app.get("/", (req, res) => {
    res.render('pages/home', { titulo: 'Home', css: 'home.css' });
})

app.get('/login', (req, res) => {
    res.render('pages/login', { titulo: 'Login', css: 'login.css' });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`)
})
