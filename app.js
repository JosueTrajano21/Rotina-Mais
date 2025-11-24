const express = require("express");
const app = express();
require("dotenv").config();

// Rotas
const atividadesRoutes = require("./routes/atividades");
const authRoutes = require("./routes/auth");

// Configurações do Express
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Rota principal
app.get("/", (req, res) => {
    res.render("pages/home", {
        titulo: "Home",
        css: "home.css"
    });
});

// Rotas
app.use("/atividades", atividadesRoutes);
app.use("/", authRoutes);

// Porta do servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
