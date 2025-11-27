const Atividade = require('../models/atividadesModel')

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

        // Filtrar tarefas
        const tarefasFiltradas =  tarefas.filter(tarefa =>{
            // Filter pq vai retornar os elementos correspondentes a condição

            const hoje = Atividade.formatarDataParaMySQL(new Date())

            if (filtro === "Sem data"){
                return !(tarefa.data)
            }
            if (filtro === "Hoje"){
                return Atividade.formatarDataParaMySQL(tarefa.data) === hoje
            } 
            if (filtro === "Semana"){
                return  estaNaSemana(tarefa.data)
            }
            if (filtro === "Mês"){
                return  estaNoMes(tarefa.data)
            }
            if (filtro === "Importantes"){
                return tarefa.favorito === 1
            }
            if (filtro === "Vencidas"){
                return Atividade.formatarDataParaMySQL(tarefa.data) < hoje && tarefa.completada === 0;
            }
            if (filtro === "Pendentes"){
                return tarefa.completada === 0;
            }
            return true
        })

        const menuItems = [
            "Sem data", "Hoje", "Semana", "Mês",
            "Importantes", "Recorrentes", "Vencidas", "Todas"
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
        const data = Atividade.formatarDataParaMySQL(new Date()) // teste
        console.log(data)

        

        if (!titulo || titulo.trim() === '') {
            const tarefas = await Atividade.listarPorPaciente(id_paciente)
            const menuItems = [
                "Sem data", "Hoje", "Semana", "Mês",
                "Importantes", "Recorrentes", "Vencidas", "Todas"
            ]
            const selecionado = 'Hoje'
            const tarefasFiltradas = tarefas

            return res.render('pages/atividades', {
                titulo: "Atividades",
                css: "atividades.css",
                tarefas: tarefas,
                menuItems: menuItems,
                selecionado: selecionado,
                tarefasFiltradas: tarefasFiltradas,
                error: 'Título é obrigatório!'
            })
        }

        await Atividade.criar({
            id_paciente,
            titulo,
            data
        })

        res.redirect('/atividades')
    }
}
