//  Ele tem as funcionalidades da área do Paciente

const Atividade = require('../models/atividadesModel')

// Função que formata a data para a data Brasileira
function formatarBr(data){
    const d = new Date(data)

    const ano = d.getFullYear()
    const mes = String(d.getMonth() + 1).padStart(2, '0')
    const dia = String(d.getDate()).padStart(2, '0')

    return `${dia}/${mes}/${ano}`
} 

// Função que verifica se a data está nesta semana
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

// Função que verifica se a data está neste mês
function estaNoMes(data){
  if (!data) return false
    const hoje = new Date()
    return data.getMonth() === hoje.getMonth() &&
    data.getFullYear() === hoje.getFullYear()  
}

module.exports = {

    // Principal página, ela vai listar as tarefas e aplicar os filtros
    index: async (req, res) => {
        const id_paciente = req.session.user.id
        const filtro = req.query.filter || "Hoje"
        console.log(req.query.filter)
        
        // Busca as atividades do paciente
        const tarefas = await Atividade.listarPorPaciente(id_paciente)

        // Formata a data para mostrar no front 
        tarefas.forEach(tarefa => {
            if(tarefa.data){
                tarefa.dataFormatada = formatarBr(tarefa.data)
            }else{
                tarefa.dataFormatada = null
            }
        })

        // Filtrar tarefas
        const tarefasFiltradas =  tarefas.filter(tarefa =>{
    
            const hoje = Atividade.formatarDataParaMySQL(new Date())

            if (filtro === "Sem data") return !tarefa.data
            if (filtro === "Hoje") return Atividade.formatarDataParaMySQL(tarefa.data) === hoje
            if (filtro === "Semana") return estaNaSemana(tarefa.data)
            if (filtro === "Mês") return estaNoMes(tarefa.data)
            if (filtro === "Importantes") return tarefa.favorito === 1
            if (filtro === "Vencidas") return Atividade.formatarDataParaMySQL(tarefa.data) < hoje && tarefa.completada === 0
            if (filtro === "Pendentes") return tarefa.completada === 0

            return true // "Todas"
        })

         // Itens do menu lateral
        const menuItems = [
            "Sem data", "Hoje", "Semana", "Mês",
            "Importantes", "Vencidas", "Pendentes", "Todas"
        ]

        // Renderiza a página com os dados
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

    // Cria uma nova tarefa
    criar: async (req, res) =>{

        const { titulo } = req.body
        const id_paciente = req.session.user.id // id do paciente
        console.log(id_paciente)
        const data = new Date()
        const dataFormatada = Atividade.formatarDataParaMySQL(data) 
        console.log(dataFormatada)
 
        // Salva no banco
        await Atividade.criarAtivadade({
            id_paciente,
            titulo,
            data: dataFormatada
        })

        res.redirect('/atividades')
    },

     // Marca tarefa como concluída ou não
    marcarCompletada: async (req, res) => {

        const { id, completada } = req.body
        
        console.log("Recebido:", req.body)

        await Atividade.marcarComoCompletada(id, completada)
        return res.json({ sucesso: true })

    },

    // Exclui uma tarefa
    excluir: async (req, res) => {

        const { id_tarefa } = req.body 
        const id_paciente = req.session.user.id

        Atividade.excluirTarefa(id_tarefa, id_paciente)

        return res.redirect(`/atividades`)
    },

    // Marca como favorita ou remove dos favoritos
    marcarFavorita: async (req, res) =>{
        const { id, favorito } = req.body

        await Atividade.marcarComoFavorita(id, favorito)
        return res.json({ sucesso: true })
    },

    // Editar os dados da atividade
    editar: async (req, res) =>{
        const {id_atividade, titulo, data, descricao} = req.body
        console.log(id_atividade, titulo, data, descricao)
        
        if (!titulo || titulo.trim() === "") {
            console.log('Erro titulo vazio')
            return res.redirect("/atividades")
        }


        await Atividade.editar(id_atividade, titulo, data, descricao)

        return res.redirect("/atividades")
    }

}
