const db = require("../database/db");
const bcrypt = require("bcrypt");

class Paciente {

    // Inicializa o objeto Paciente
    constructor(dados = {}) {
        this.id = dados.id_paciente || null;
        this.name = dados.name || "";
        this.email = dados.email || "";
        this.senha = dados.senha || "";
        this.id_psicologo = dados.id_psicologo || null;
    }

    // Lista todos os pacientes
    static async listar() {
        const [resultado] = await db.query(
            "SELECT id_paciente, name, email FROM paciente"
        );
        // Converte cada linha em um objeto Ppaciente
        return resultado.map(dados => new Paciente(dados));
    }

    // Salva novo paciente no banco com senha criptografada
    async salvar() {
        const hash = await bcrypt.hash(this.senha, 10);

        const [resultado] = await db.query(
            "INSERT INTO paciente (name, email, senha) VALUES (?, ?, ?)",
            [this.name, this.email, hash]
        );

        this.id = resultado.insertId; // guarda o ID gerado
        return this.id;
    }

    // Busca um paciente pelo email
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
    // Compara senha digitada com o hash salvo no banco
    async verificarSenha(senhaDigitada) {
        return bcrypt.compare(senhaDigitada, this.senha);
    }
}

module.exports = Paciente;
