// criação/listagem de atividades.
const db = require('../database/db')

class Atividade {
    
    // Busca todas as atividades de um paciente
    static async listarPorPaciente(id_paciente){
        const [rows] = await db.query(
            "SELECT * FROM atividade WHERE id_paciente = ?",
            [id_paciente]
        )
        return rows
    }
    
    // Cria uma nova atividade
    static async criarAtivadade({id_paciente, titulo, data = null}){
        console.log("VALOR RECEBIDO EM criar():", { id_paciente, titulo, data })
        const [resultado] = await db.query(
            "INSERT INTO atividade (id_paciente, titulo, data) VALUES (?, ?, ?)",
            [id_paciente, titulo, data]
        )
        return resultado.insertId // retorna o ID gerado
    }

    // Converte data para formato aceito no mysql
    static formatarDataParaMySQL(data){
        const d = new Date(data)

        const ano = d.getFullYear()
        const mes = String(d.getMonth() + 1).padStart(2, '0')
        const dia = String(d.getDate()).padStart(2, '0')

        return `${ano}-${mes}-${dia}`
    }

    // Marca atividade como concluída ou não
    static async marcarComoCompletada(id, completada){
        const [resultado] = await db.query(
            "UPDATE atividade SET completada = ? WHERE id_atividade = ?",
            [completada, id]
        )
    }

    // Exclui a atividade do paciente
    static async excluirTarefa(id_atividade, id_paciente){
        const [resultado] = await db.query(
            "DELETE FROM atividade WHERE id_atividade = ? AND id_paciente = ?",
            [id_atividade, id_paciente]
        )
        return resultado.affectedRows > 0
    }

    // Marca ou desmarca atividade como favorita
    static async marcarComoFavorita(id, favorito){
        const [resultado] = await db.query(
            "UPDATE atividade SET favorito = ? WHERE id_atividade = ?",
            [favorito, id]
        )
        return resultado.affectedRows > 0
    }

    static async editar(id, titulo, data, descricao){
        console.log(data)
        if(!titulo){
            return 
        }
        if(!data){
            data = null
        }
        console.log(data)
        const [resultado] = await db.query(
            "UPDATE atividade SET titulo = ?, data = ?, descricao = ? WHERE id_atividade = ?",
            [titulo, data, descricao, id]
        )

        return resultado.affectedRows > 0;
    }


}

module.exports = Atividade;