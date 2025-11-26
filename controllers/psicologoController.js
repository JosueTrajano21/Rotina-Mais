// carrega dados gerais de todos os usuários

const PacientesGeral = require('../models/pacientesPsicologoModels')

function calcularMetricasTarefas(tarefas) {
    const hoje = new Date();

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
    };
}

module.exports = {

    index: async (req, res) =>{

        const id_psicologo = req.session.user.id
        
        const pacientes = await PacientesGeral.listarTodosPacientes(id_psicologo)

        res.render("pages/psicologo_geral", {
            titulo: "Todos os Pacientes",
            css: "psicologoGeral.css",
            pacientes
        })
    },

    adicionar: async (req, res) =>{
        const {id_paciente} = req.body
        const id_psicologo = req.session.user.id

        const pacientes = await PacientesGeral.listarTodosPacientes(id_psicologo)

        if(!id_paciente){
            return res.render("pages/psicologo_geral", {
                        titulo: "Todos os Pacientes",
                        css: "psicologoGeral.css",
                        pacientes,
                        error: 'ID do paciente é obrigatório'
                    })
        }

        const sucesso = await PacientesGeral.adicionarPaciente(id_paciente, id_psicologo);

        if(!sucesso){
            return res.render("pages/psicologo_geral", {
                        titulo: "Todos os Pacientes",
                        css: "psicologoGeral.css",
                        pacientes,
                        error: 'Não foi possível adicionar paciente'
                    })
        }

        res.redirect("/psicologo_geral"); 
    },

    excluir: async (req, res) => {
        const { id_paciente } = req.body; 
        const id_psicologo = req.session.user.id

        const pacientes = await PacientesGeral.listarTodosPacientes(id_psicologo)
        
        const sucesso = await PacientesGeral.excluirPaciente(id_paciente, id_psicologo);
        if (!sucesso) {
            return res.render("pages/psicologo_geral", {
                        titulo: "Todos os Pacientes",
                        css: "psicologoGeral.css",
                        pacientes,
                        error: 'Não foi possível excluir o paciente'
                    })
        }
    
        res.redirect("/psicologo_geral");
    },

    acompanharPaciente: async (req, res) => {
        const id_paciente = req.params.id; // pega o id do paciente da rota
        const id_psicologo = req.session.user.id; // só para garantir que é o psicologo certo

        console.log(id_paciente)
        const paciente = await PacientesGeral.listarPacientePorId(id_paciente, id_psicologo)
        const tarefas = await PacientesGeral.listarTarefasPacientePorId(id_paciente)

        console.log(tarefas)
        console.log(paciente)
        
        if (!paciente) {
            return res.send("Paciente não encontrado ou não pertence a você.");
        }

        const metricas = calcularMetricasTarefas(tarefas);

        res.render("pages/psicologo_individual", {
            titulo: `Acompanhar ${paciente.name}`,
            css: "acompanhar.css",
            paciente: {
                ...paciente,
                metricas: metricas
            },
            tarefas
        });
    }

}