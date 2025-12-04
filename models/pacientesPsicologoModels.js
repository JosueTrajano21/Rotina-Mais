// Adição e gerenciamento de pacientes do psicólogo

const db = require('../database/db')

class PacientesGeral {
    
    // Adiciona um paciente ao psicólogo
    static async adicionarPaciente(id_paciente, id_psicologo) {
        const [resultado] = await db.query(
            "UPDATE paciente SET id_psicologo = ? WHERE id_paciente = ?",
            [id_psicologo, id_paciente]
        )
        return resultado.affectedRows > 0 // retorna sucesso ou falha
    }

    // Lista todos os pacientes ligados ao psicólogo
    static async listarTodosPacientes(id_psicologo) {
        const [resultado] = await db.query(
            "SELECT * FROM paciente where id_psicologo = ?",
            [id_psicologo]
        )
        return resultado
    }

    // Busca um paciente específico do psicólogo
    static async excluirPaciente(id_paciente, id_psicologo){
        const [resultado] = await db.query(
            "UPDATE paciente SET id_psicologo = NULL WHERE id_paciente = ? AND id_psicologo = ?",
            [id_paciente, id_psicologo]
        )

        return resultado.affectedRows > 0
    }

    // Lista todas as tarefas do paciente
    static async listarPacientePorId(id_paciente, id_psicologo) {
        const [resultado] = await db.query(
            "SELECT * FROM paciente WHERE id_paciente = ? AND id_psicologo = ?",
            [id_paciente, id_psicologo]
        )
        return resultado[0] // retorna o paciente ou undefined
    }

    // Lista todas as tarefas do paciente
    static async listarTarefasPacientePorId(id_paciente) {
        const [resultado] = await db.query(
            "SELECT * FROM atividade WHERE id_paciente = ?",
            [id_paciente]
        )
        return resultado
    }
}

module.exports = PacientesGeral
