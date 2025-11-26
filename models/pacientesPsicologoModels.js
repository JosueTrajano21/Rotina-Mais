// Adição de pacientes

const db = require('../database/db')

class PacientesGeral {
    
    static async adicionarPaciente(id_paciente, id_psicologo) {
        const [resultado] = await db.query(
            "UPDATE paciente SET id_psicologo = ? WHERE id_paciente = ?",
            [id_psicologo, id_paciente]
        )
        return resultado.affectedRows > 0
    }

    static async listarTodosPacientes(id_psicologo) {
        const [resultado] = await db.query(
            "SELECT * FROM paciente where id_psicologo = ?",
            [id_psicologo]
        )
        return resultado
    }

    static async excluirPaciente(id_paciente, id_psicologo){
        const [resultado] = await db.query(
            "UPDATE paciente SET id_psicologo = NULL WHERE id_paciente = ? AND id_psicologo = ?",
            [id_paciente, id_psicologo]
        )

        return resultado.affectedRows > 0
    }

    static async listarPacientePorId(id_paciente, id_psicologo) {
        const [rows] = await db.query(
            "SELECT * FROM paciente WHERE id_paciente = ? AND id_psicologo = ?",
            [id_paciente, id_psicologo]
        )
        return rows[0] 
    }

    static async listarTarefasPacientePorId(id_paciente) {
        const [rows] = await db.query(
            "SELECT * FROM atividade WHERE id_paciente = ?",
            [id_paciente]
        )
        return rows
    }
}

module.exports = PacientesGeral
