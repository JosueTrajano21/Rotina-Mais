// Controller da área geral do psicólogo

const PacientesGeral = require('../models/pacientesPsicologoModels')

// Calcula métricas das tarefas do paciente
function calcularMetricasTarefas(tarefas) {
    const hoje = new Date()
    hoje.setHours(0,0,0,0)

    const tarefasConcluidas = tarefas.filter(tarefa => tarefa.completada === 1).length

    const tarefasAtrasadas = tarefas.filter(tarefa => {
        if (tarefa.completada === 1) return false

        if (!tarefa.data) return false

        const dataTarefa = new Date(tarefa.data)
        return dataTarefa < hoje
    }).length

    const tarefasPendentes = tarefas.filter(tarefa => tarefa.completada === 0).length

    return {
        tarefasConcluidas,
        tarefasAtrasadas,
        tarefasPendentes
    }
}

module.exports = {

    // Página principal com lista de pacientes
    index: async (req, res) =>{

        const id_psicologo = req.session.user.id
        
        const pacientes = await PacientesGeral.listarTodosPacientes(id_psicologo)

        res.render("pages/psicologo_geral", {
            titulo: "Todos os Pacientes",
            css: "psicologoGeral.css",
            pacientes
        })
    },

    // Adiciona paciente ao psicólogo
    adicionar: async (req, res) =>{
        const {id_paciente} = req.body
        const id_psicologo = req.session.user.id

        const pacientes = await PacientesGeral.listarTodosPacientes(id_psicologo)

        // Válida se o ID foi enviado
        if(!id_paciente){
            return res.render("pages/psicologo_geral", {
                        titulo: "Todos os Pacientes",
                        css: "psicologoGeral.css",
                        pacientes,
                        error: 'ID do paciente é obrigatório'
                    })
        }

        const sucesso = await PacientesGeral.adicionarPaciente(id_paciente, id_psicologo)

        // Válida se o ID existe
        if(!sucesso){
            return res.render("pages/psicologo_geral", {
                        titulo: "Todos os Pacientes",
                        css: "psicologoGeral.css",
                        pacientes,
                        error: 'Não foi possível adicionar paciente'
                    })
        }

        res.redirect("/psicologo_geral") 
    },

    // Remove paciente do psicólogo
    excluir: async (req, res) => {
        const { id_paciente } = req.body 
        const id_psicologo = req.session.user.id
        const pacientes = await PacientesGeral.listarTodosPacientes(id_psicologo)

        // Tenta excluir no banco
        const sucesso = await PacientesGeral.excluirPaciente(id_paciente, id_psicologo)

        if (!sucesso) {
            return res.render("pages/psicologo_geral", {
                        titulo: "Todos os Pacientes",
                        css: "psicologoGeral.css",
                        pacientes,
                        error: 'Não foi possível excluir o paciente'
                    })
        }
    
        res.redirect("/psicologo_geral")
    },

    // Exibe o paciente e suas tarefas
    acompanharPaciente: async (req, res) => {
        const id_paciente = req.params.id // pega o id do paciente da rota
        const id_psicologo = req.session.user.id // só para garantir que é o psicologo certo

        console.log(id_paciente)
        const paciente = await PacientesGeral.listarPacientePorId(id_paciente, id_psicologo)
        const tarefas = await PacientesGeral.listarTarefasPacientePorId(id_paciente)

        console.log(tarefas)
        console.log(paciente)
        
        // Se o paciente não pertencer ao psicólogo
        if (!paciente) {
            return res.render("pages/psicologo_geral", {
                        titulo: "Todos os Pacientes",
                        css: "psicologoGeral.css",
                        pacientes,
                        error: 'Paciente não existe ou não pertence a você'
                    })
        }

        const metricas = calcularMetricasTarefas(tarefas)

        res.render("pages/psicologo_individual", {
            titulo: `Acompanhar ${paciente.name}`,
            css: "acompanhar.css",
            paciente: {
                ...paciente,
                metricas: metricas
            },
            tarefas
        })
    }

}