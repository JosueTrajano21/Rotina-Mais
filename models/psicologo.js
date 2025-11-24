const db = require("../database/db");
const bcrypt = require("bcrypt");

class Psicologo {

    constructor(dados = {}) {
        this.id = dados.id_psicologo || null;
        this.name = dados.name || "";
        this.email = dados.email || "";
        this.senha = dados.senha || "";
    }

    static async listar() {
        const [rows] = await db.query(
            "SELECT id_psicologo, name, email FROM psicologo"
        );
        return rows.map(dados => new Psicologo(dados));
    }

    async salvar() {
        const hash = await bcrypt.hash(this.senha, 10);

        const [resultado] = await db.query(
            "INSERT INTO psicologo (name, email, senha) VALUES (?, ?, ?)",
            [this.name, this.email, hash]
        );

        this.id = resultado.insertId;
        return this.id;
    }

    static async buscarPorEmail(email) {
        const [rows] = await db.query(
            "SELECT * FROM psicologo WHERE email = ?",
            [email]
        );

        if (rows.length > 0) {
            return new Psicologo(rows[0]);
        }

        return null;
    }

    async verificarSenha(senhaDigitada) {
        return bcrypt.compare(senhaDigitada, this.senha);
    }
}

module.exports = Psicologo;
