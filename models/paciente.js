const db = require("../database/db");
const bcrypt = require("bcrypt");

class Paciente {

    constructor(dados = {}) {
        this.id = dados.id_paciente || null;
        this.name = dados.name || "";
        this.email = dados.email || "";
        this.senha = dados.senha || "";
        this.id_psicologo = dados.id_psicologo || null;
    }

    static async listar() {
        const [resultado] = await db.query(
            "SELECT id_paciente, name, email FROM paciente"
        );
        return resultado.map(dados => new Paciente(dados));
    }

    async salvar() {
        const hash = await bcrypt.hash(this.senha, 10);

        const [resultado] = await db.query(
            "INSERT INTO paciente (name, email, senha) VALUES (?, ?, ?)",
            [this.name, this.email, hash]
        );

        this.id = resultado.insertId;
        return this.id;
    }

    static async buscarPorEmail(email) {
        const [resultado] = await db.query(
            "SELECT * FROM paciente WHERE email = ?",
            [email]
        );

        if (resultado.length > 0) {
            return new Paciente(resultado[0]);
        }

        return null;
    }

    async verificarSenha(senhaDigitada) {
        return bcrypt.compare(senhaDigitada, this.senha);
    }
}

module.exports = Paciente;
