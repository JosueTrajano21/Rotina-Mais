// criação/listagem de atividades.
const db = require('../database/db')

class Atividade {
    
    static async listarPorPaciente(id_paciente){
        const [rows] = await db.query(
            "SELECT * FROM atividade WHERE id_paciente = ?",
            [id_paciente]
        )
        return rows
    }

    static async criar({id_paciente, titulo, data = null}){
        console.log("VALOR RECEBIDO EM criar():", { id_paciente, titulo, data })
        const [resultado] = await db.query(
            "INSERT INTO atividade (id_paciente, titulo, data) VALUES (?, ?, ?)",
            [id_paciente, titulo, data]
        )
        return resultado.insertId
    }


    static formatarDataParaMySQL(data) {
        const d = new Date(data)

        const ano = d.getFullYear()
        const mes = String(d.getMonth() + 1).padStart(2, '0')
        const dia = String(d.getDate()).padStart(2, '0')

        return `${ano}-${mes}-${dia}`
    }

    // CRIAR FUNÇÃO PARA CHECAR A DATA NO BANCO PARA O FILTRO 

}

module.exports = Atividade;
