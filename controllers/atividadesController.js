const Atividade = require('../models/atividadesModel')
    
function formatarBr(data){
    const d = new Date(data)

    const ano = d.getFullYear()
    const mes = String(d.getMonth() + 1).padStart(2, '0')
    const dia = String(d.getDate()).padStart(2, '0')

    return `${dia}/${mes}/${ano}`
} 

function estaNaSemana(data){
    if (!data) return false
    const hoje = new Date()
    hoje.setHours(0,0,0,0)
    
    const inicioSemana = new Date(hoje.setDate(hoje.getDate() - hoje.getDay()))
    console.log(inicioSemana)
    const fimSemana = new Date(inicioSemana)
    fimSemana.setDate(inicioSemana.getDate() + 6)

    if (data > inicioSemana && data < fimSemana){
        return data
    }
}

function estaNoMes(data){
  if (!data) return false
    const hoje = new Date()
    return data.getMonth() === hoje.getMonth() &&
    data.getFullYear() === hoje.getFullYear()  
}

module.exports = {
    index: async (req, res) => {
        const id_paciente = req.session.user.id
        const filtro = req.query.filter || "Hoje"
        
        // Busca as atividades do paciente
        const tarefas = await Atividade.listarPorPaciente(id_paciente)

        tarefas.forEach(tarefa => {
            if(tarefa.data){
                tarefa.dataFormatada = formatarBr(tarefa.data)
            }else{
                tarefa.dataFormatada = null
            }
        })


        const menuItems = [
            "Sem data", "Hoje", "Semana", "Mês",
            "Importantes", "Vencidas", "Pendentes", "Todas"
        ]

        res.render("pages/atividades", {
            titulo: "Atividades",
            css: "atividades.css",
            tarefas,
            menuItems,
            filtro,
            tarefasFiltradas,
            selecionado: filtro,
        })
    },

    criar: async (req, res) =>{

        const { titulo } = req.body
        const id_paciente = req.session.user.id // id do paciente
        console.log(id_paciente)
        const data = new Date()
        const dataFormatada = Atividade.formatarDataParaMySQL(data) 
        console.log(dataFormatada)

        

        if (!titulo || titulo.trim() === '') {
            const tarefa = await Atividade.listarPorPaciente(id_paciente)
            const menuItems = [
                "Sem data", "Hoje", "Semana", "Mês",
                "Importantes", "Recorrentes", "Vencidas", "Todas"
            ]
            const selecionado = 'Hoje'
            const tarefasFiltradas = tarefa

            return res.render('pages/atividades', {
                titulo: "Atividades",
                css: "atividades.css",
                tarefas: tarefas,
                menuItems: menuItems,
                selecionado: selecionado,
                tarefasFiltradas: tarefasFiltradas,
                error: 'Título é obrigatório!',
            })
        }

        await Atividade.criarAtivadade({
            id_paciente,
            titulo,
            data: dataFormatada
        })

        res.redirect('/atividades')
    },

    
    marcarCompletada: async (req, res) => {
        console.log(req.body)

        const { id, completada } = req.body
        
        console.log("Recebido:", req.body)

        if(!id){
            return res.status(400).json({ erro: "ID da tarefa é obrigatório." })
        }

        await Atividade.marcarComoCompletada(id, completada)
        return res.json({ sucesso: true })

    },

    excluir: async (req, res) => {
        const { id_tarefa } = req.body; 
        const id_paciente = req.session.user.id
        
        const sucesso = await Atividade.excluirTarefa(id_tarefa, id_paciente);

        if (!sucesso) {
            const tarefas = await Atividade.listarPorPaciente(id_paciente);

            const menuItems = [
                "Sem data", "Hoje", "Semana", "Mês",
                "Importantes", "Vencidas", "Todas"
            ];

            const filtro = "Hoje";
            const tarefasFiltradas = tarefas;

            return res.render("pages/atividades", {
                titulo: "Atividades",
                css: "atividades.css",
                tarefas,
                menuItems,
                filtro,
                tarefasFiltradas,
                selecionado: filtro,
                error: "Erro ao excluir tarefa."
            });
        }

        res.redirect("/atividades");
    },

    marcarFavorita: async (req, res) =>{
        const { id, favorito } = req.body;

        if (!id) {
            return res.status(400).json({ erro: "ID é obrigatório" });
        }

        await Atividade.marcarComoFavorita(id, favorito);
        return res.json({ sucesso: true });
    }

}
